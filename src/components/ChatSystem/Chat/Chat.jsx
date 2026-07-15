import { useState, useRef, useEffect } from 'react';
import './Chat.css';
import api from '../../../api';

// The logged-in admin (used to identify "self" among participants / message senders)
const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
const adminId = adminUser._id || adminUser.id;
const adminEmail = adminUser.email;

// True when the given participant/sender is the logged-in admin
const isSelf = (person) => {
  if (!person) return false;
  if (adminId && person._id) return person._id === adminId;
  if (adminEmail && person.email) return person.email === adminEmail;
  return false;
};

const participantName = (person) =>
  person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : 'Unknown';

// Maps a backend chat document into the shape the UI consumes, preserving
// any local-only flags (unread / favourite / archived) already tracked.
const mapChat = (chat, prevFlags = {}) => {
  const other = (chat.participants || []).find(p => !isSelf(p)) || {};
  return {
    id: chat._id,
    name: participantName(other),
    role: other.role || 'Technician',
    participantId: other._id,
    lastMsg: chat.lastMessage?.content || 'No messages yet',
    date: chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : '',
    unread: prevFlags.unread || false,
    favourite: prevFlags.favourite || false,
    archived: prevFlags.archived || false,
  };
};

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // New Message Mode states
  const [isNewMessageMode, setIsNewMessageMode] = useState(false);
  const [newUserSearch, setNewUserSearch] = useState('');

  const [messages, setMessages] = useState({});
  const [typedMessage, setTypedMessage] = useState('');
  const messageAreaRef = useRef(null);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [activeChat, messages]);

  const loadChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(prev => {
        const flagMap = Object.fromEntries(prev.map(c => [c.id, c]));
        return (res.data || []).map(chat => mapChat(chat, flagMap[chat._id]));
      });
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const loadTechnicians = async () => {
    try {
      const res = await api.get('/users/technicians');
      setTechnicians(res.data || []);
    } catch (err) {
      console.error('Failed to load technicians:', err);
    }
  };

  // Load chats whenever the widget is opened
  useEffect(() => {
    if (isOpen) (async () => { await loadChats(); })();
  }, [isOpen]);

  // Load the technician list used by the New Message composer
  useEffect(() => {
    (async () => { await loadTechnicians(); })();
  }, []);

  // Load messages when a chat is opened
  useEffect(() => {
    if (!activeChat) return;
    async function loadMessages() {
      try {
        const res = await api.get(`/chats/${activeChat.id}/messages`);
        const mapped = (res.data || []).map(msg => ({
          id: msg._id,
          text: msg.content,
          sender: isSelf(msg.sender) ? 'me' : 'other',
          time: msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
        }));
        setMessages(prev => ({ ...prev, [activeChat.id]: mapped }));
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    }
    loadMessages();
  }, [activeChat]);

  // Tab Filtering & Main Search Logic
  const processedChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'Unread' && !chat.unread) return false;
    if (activeTab === 'Archived' && !chat.archived) return false;
    if (activeTab === 'Favourite' && !chat.favourite) return false;

    // Explicit Rule: All tab displays everything except archived chats
    if (activeTab === 'All' && chat.archived) return false;

    if (filterType === 'unread' && !chat.unread) return false;
    if (filterType === 'read' && chat.unread) return false;

    return matchesSearch;
  });

  // Filter technicians for the New Message search engine
  const filteredNewUsers = technicians.filter(tech =>
    `${tech.firstName || ''} ${tech.lastName || ''}`.toLowerCase().includes(newUserSearch.toLowerCase())
  );

  // Dynamic context action updates (local-only state, not tracked by the backend)
  const handleAction = (id, action) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === id) {
        if (action === 'read') return { ...chat, unread: !chat.unread };
        if (action === 'archive') return { ...chat, archived: !chat.archived }; // Toggles archive/unarchive status
        if (action === 'star') return { ...chat, favourite: !chat.favourite };
      }
      return chat;
    }));
    if (action === 'delete') {
      setChats(prev => prev.filter(chat => chat.id !== id));
    }
    setActiveMenuId(null);
  };

  const handleSendMessage = async () => {
    if (!typedMessage.trim() || !activeChat) return;
    const chatId = activeChat.id;
    const content = typedMessage;
    const optimisticMsg = { id: `temp-${chatId}-${content.length}`, text: content, sender: 'me', time: 'Just now' };

    // Optimistically show the message immediately
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), optimisticMsg]
    }));
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMsg: content } : c));
    setTypedMessage('');

    // Confirm with the API
    try {
      await api.post(`/chats/${chatId}/messages`, { content });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSelectUserForNewMessage = async (tech) => {
    try {
      const res = await api.post('/chats', { participantId: tech._id });
      const flagMap = Object.fromEntries(chats.map(c => [c.id, c]));
      const mapped = mapChat(res.data, flagMap[res.data._id]);

      setChats(prev => {
        const exists = prev.some(c => c.id === mapped.id);
        return exists ? prev.map(c => (c.id === mapped.id ? { ...c, archived: false } : c)) : [mapped, ...prev];
      });

      setActiveChat(mapped);
      setIsNewMessageMode(false);
      setNewUserSearch('');
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  return (
    <div className={`lk-chat-widget ${isOpen ? 'is-open' : 'is-closed'} ${activeChat ? 'is-viewing-chat' : ''}`}>

      {/* --- CHAT HUB CORE HEADER --- */}
      <div className="lk-chat-header" onClick={() => { if (!activeChat) { setIsOpen(!isOpen); setIsNewMessageMode(false); } }}>
        <div className="lk-header-left">
          <div className="lk-avatar-container">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Me" className="lk-user-pfp" />
            <span className="lk-status-dot online"></span>
          </div>
          <span className="lk-header-title">Messaging</span>
        </div>

        <div className="lk-header-right" onClick={(e) => e.stopPropagation()}>
          <button className="lk-icon-btn"><i className="fa-solid fa-ellipsis"></i></button>

          {/* New Message Pen Icon Toggle */}
          <button
            className={`lk-icon-btn ${isNewMessageMode ? 'active-pen-icon' : ''}`}
            onClick={() => { setIsOpen(true); setActiveChat(null); setIsNewMessageMode(!isNewMessageMode); }}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>

          <button className="lk-icon-btn toggle-arrow" onClick={() => { setIsOpen(!isOpen); setIsNewMessageMode(false); }}>
            <i className={`fa-solid ${isOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lk-chat-body">

          {/* --- NEW MESSAGE MODE VIEW (Fade overlay block layout) --- */}
          {isNewMessageMode ? (
            <div className="lk-new-message-pane animate-fade-in">
              <div className="lk-new-message-search-bar">
                <span>To:</span>
                <input
                  type="text"
                  placeholder="Type a name to start a new chat..."
                  autoFocus
                  value={newUserSearch}
                  onChange={(e) => setNewUserSearch(e.target.value)}
                />
                <button className="lk-close-search-text" onClick={() => setIsNewMessageMode(false)}>Cancel</button>
              </div>

              <div className="lk-new-users-results-list">
                {filteredNewUsers.length === 0 ? (
                  <div className="lk-empty-category-state">
                    <i className="fa-solid fa-user-slash"></i>
                    <p>No connections found matching "{newUserSearch}"</p>
                  </div>
                ) : (
                  filteredNewUsers.map(tech => (
                    <div key={tech._id} className="lk-new-user-row-item" onClick={() => handleSelectUserForNewMessage(tech)}>
                      <img src={tech.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${tech.firstName} ${tech.lastName}`)}&background=random`} alt="" className="lk-new-user-avatar" />
                      <div className="lk-new-user-details">
                        <h5>{tech.firstName} {tech.lastName}</h5>
                        <p>{tech.role || 'Technician'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : !activeChat ? (

            /* --- DEFAULT CHAT LIST VIEW --- */
            <div className="lk-default-list-wrapper animate-fade-in">
              <div className="lk-search-filter-wrapper">
                <div className="lk-search-box">
                  <i className="fa-solid fa-magnifying-glass lk-search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search messages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="lk-filter-trigger" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                    <i className="fa-solid fa-sliders"></i>
                  </button>

                  {showFilterDropdown && (
                    <div className="lk-filter-menu">
                      <div className={`lk-filter-item ${filterType === 'name' ? 'active' : ''}`} onClick={() => { setFilterType('name'); setShowFilterDropdown(false); }}>Filter by Name</div>
                      <div className={`lk-filter-item ${filterType === 'unread' ? 'active' : ''}`} onClick={() => { setFilterType('unread'); setShowFilterDropdown(false); }}>Unread</div>
                      <div className={`lk-filter-item ${filterType === 'read' ? 'active' : ''}`} onClick={() => { setFilterType('read'); setShowFilterDropdown(false); }}>Read</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tab Elements */}
              <div className="lk-tabs-bar">
                {['All', 'Unread', 'Archived', 'Favourite'].map(tab => (
                  <button
                    key={tab}
                    className={`lk-tab-btn ${activeTab === tab ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Chat List Handling Container */}
              <div className="lk-chats-list">
                {processedChats.length === 0 ? (
                  /* Employs Empty Category Fallback Handler */
                  <div className="lk-empty-category-state">
                    <i className="fa-regular fa-message lk-empty-state-icon"></i>
                    <h4>No messages available</h4>
                    <p>There are no conversations in your {activeTab.toLowerCase()} category.</p>
                  </div>
                ) : (
                  processedChats.map(chat => (
                    <div key={chat.id} className={`lk-chat-item ${chat.unread ? 'unread-style' : ''}`} onClick={() => setActiveChat(chat)}>
                      <div className="lk-item-avatar-wrapper">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`} alt={chat.name} className="lk-item-pfp" />
                        <span className="lk-status-dot online-hollow"></span>
                      </div>

                      <div className="lk-item-content">
                        <div className="lk-item-row-one">
                          <h4 className="lk-item-name">{chat.name}</h4>

                          <div className="lk-action-zone" onClick={(e) => e.stopPropagation()}>
                            <span className="lk-item-date">{chat.date}</span>
                            <button className="lk-dots-action-btn" onClick={() => setActiveMenuId(activeMenuId === chat.id ? null : chat.id)}>
                              <i className="fa-solid fa-ellipsis"></i>
                            </button>

                            {activeMenuId === chat.id && (
                              <div className="lk-action-popup-menu">
                                <div onClick={() => handleAction(chat.id, 'read')}><i className="fa-regular fa-envelope"></i> Mark as {chat.unread ? 'Read' : 'Unread'}</div>

                                {/* Dynamic toggle label changes back and forth between Archive and Unarchive */}
                                <div onClick={() => handleAction(chat.id, 'archive')}>
                                  <i className="fa-regular fa-folder-open"></i>
                                  {chat.archived ? 'Unarchive' : 'Archive'}
                                </div>

                                <div onClick={() => handleAction(chat.id, 'star')}><i className="fa-regular fa-star"></i> {chat.favourite ? 'Unstar' : 'Star Favourite'}</div>
                                <div onClick={() => handleAction(chat.id, 'delete')} className="danger-action"><i className="fa-regular fa-trash-can"></i> Delete Conversation</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="lk-item-msg-preview">{chat.lastMsg}</p>
                      </div>
                      {chat.unread && <span className="lk-unread-pill-indicator">1</span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (

            /* --- DEEP CHAT VIEWTIMELINE --- */
            <div className="lk-chat-detail-panel">
              <div className="lk-detail-header">
                <div className="lk-detail-header-left" onClick={() => setActiveChat(null)}>
                  <i className="fa-solid fa-arrow-left lk-back-arrow"></i>
                  <div>
                    <h4 className="lk-detail-name">{activeChat.name}</h4>
                    <span className="lk-detail-status">Mobile • 1d ago</span>
                  </div>
                </div>
                <div className="lk-detail-header-right">
                  <button className="lk-icon-btn"><i className="fa-solid fa-ellipsis"></i></button>
                  <button className="lk-icon-btn"><i className="fa-solid fa-arrows-up-down-left-right"></i></button>
                  <button className="lk-icon-btn" onClick={() => setActiveChat(null)}><i className="fa-solid fa-xmark"></i></button>
                </div>
              </div>

              <div className="lk-messages-timeline" ref={messageAreaRef}>
                <div className="lk-user-intro-card">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}&background=random`} alt={activeChat.name} className="lk-intro-avatar" />
                  <h3>{activeChat.name} <span className="lk-badge-dist">· 1st</span></h3>
                  <p>{activeChat.role}</p>
                </div>

                {(messages[activeChat.id] || []).map(msg => (
                  <div key={msg.id} className={`lk-msg-bubble-group ${msg.sender === 'me' ? 'outgoing' : ''}`}>
                    <div className="lk-msg-bubble-contents">
                      <h5>{msg.sender === 'me' ? 'You' : activeChat.name} <span>• {msg.time}</span></h5>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lk-chat-input-composer">
                <div className="lk-textarea-container">
                  <textarea
                    placeholder="Write a message..."
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  <i className="fa-solid fa-chevron-up lk-expand-input-icon"></i>
                </div>

                {/* Toolbar Context (Gif and Emojis removed completely) */}
                <div className="lk-composer-toolbar">
                  <div className="lk-toolbar-left-actions">
                    <button className="lk-toolbar-btn" onClick={() => document.getElementById('img-inp').click()} title="Send Image">
                      <i className="fa-regular fa-image"></i>
                    </button>
                    <button className="lk-toolbar-btn" onClick={() => document.getElementById('doc-inp').click()} title="Attach Document">
                      <i className="fa-solid fa-paperclip"></i>
                    </button>

                    <input type="file" id="img-inp" accept="image/*" style={{ display: 'none' }} onChange={(e) => setTypedMessage(p => p + ` [Image: ${e.target.files[0].name}] `)} />
                    <input type="file" id="doc-inp" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => setTypedMessage(p => p + ` [Document: ${e.target.files[0].name}] `)} />
                  </div>

                  <div className="lk-toolbar-right-actions">
                    <span className="lk-submit-tip-label">Press Enter to Send</span>
                    <button className="lk-icon-btn"><i className="fa-solid fa-ellipsis"></i></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}