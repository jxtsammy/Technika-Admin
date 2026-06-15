import { useState, useRef, useEffect } from 'react';
import './Chat.css';

const INITIAL_CHATS = [
  { id: 1, name: 'Ebenezer Quarcoo', role: 'Cyber Security and Digital Forensics Student || Graphic Designer', lastMsg: 'Ebenezer: Congrats on the new role!', date: 'May 11', unread: true, favourite: false, archived: false },
  { id: 2, name: 'Fiador Prince', role: 'Solutions Architect', lastMsg: 'Fiador: yes please, All is well', date: 'May 6', unread: true, favourite: false, archived: false },
  { id: 3, name: 'Stephen Quarcoo', role: 'Software Engineer', lastMsg: "Stephen: You're welcome", date: 'May 6', unread: false, favourite: false, archived: false },
  { id: 4, name: 'Maneedeep Mangapoti', role: 'DevOps Lead', lastMsg: "Maneedeep: You're welcome", date: 'May 6', unread: false, favourite: false, archived: false }
];

// Master list of all possible system users to start a new message with
const ALL_SYSTEM_USERS = [
  { id: 1, name: 'Ebenezer Quarcoo', role: 'Cyber Security and Digital Forensics Student || Graphic Designer' },
  { id: 2, name: 'Fiador Prince', role: 'Solutions Architect' },
  { id: 3, name: 'Stephen Quarcoo', role: 'Software Engineer' },
  { id: 4, name: 'Maneedeep Mangapoti', role: 'DevOps Lead' },
  { id: 5, name: 'Samuel Sallo', role: 'Frontend Developer' },
  { id: 6, name: 'Ama Serwaa', role: 'UI/UX Designer' }
];

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState(INITIAL_CHATS);
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

  // Filter system users for the New Message search engine
  const filteredNewUsers = ALL_SYSTEM_USERS.filter(user =>
    user.name.toLowerCase().includes(newUserSearch.toLowerCase())
  );

  // Dynamic context action updates
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

  const handleSendMessage = () => {
    if (!typedMessage.trim() || !activeChat) return;
    const chatId = activeChat.id;
    const newMsg = { id: Date.now(), text: typedMessage, sender: 'me', time: 'Just now' };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));

    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMsg: `You: ${typedMessage}`, date: 'Just now' } : c));
    setTypedMessage('');
  };

  const handleSelectUserForNewMessage = (user) => {
    // Check if conversation track already exists
    let existingChat = chats.find(c => c.name === user.name);

    if (!existingChat) {
      const newChatObj = {
        id: chats.length + 1,
        name: user.name,
        role: user.role,
        lastMsg: 'No messages yet',
        date: 'Now',
        unread: false,
        favourite: false,
        archived: false
      };
      setChats(prev => [newChatObj, ...prev]);
      existingChat = newChatObj;
    } else if (existingChat.archived) {
      // If conversation is archived, safely restore it
      existingChat.archived = false;
    }

    setActiveChat(existingChat);
    setIsNewMessageMode(false);
    setNewUserSearch('');
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
                  filteredNewUsers.map(user => (
                    <div key={user.id} className="lk-new-user-row-item" onClick={() => handleSelectUserForNewMessage(user)}>
                      <img src={`https://i.pravatar.cc/150?img=${user.id + 10}`} alt="" className="lk-new-user-avatar" />
                      <div className="lk-new-user-details">
                        <h5>{user.name}</h5>
                        <p>{user.role}</p>
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
                        <img src={`https://i.pravatar.cc/150?img=${chat.id + 10}`} alt={chat.name} className="lk-item-pfp" />
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
                  <img src={`https://i.pravatar.cc/150?img=${activeChat.id + 10}`} alt={activeChat.name} className="lk-intro-avatar" />
                  <h3>{activeChat.name} <span className="lk-badge-dist">· 1st</span></h3>
                  <p>{activeChat.role}</p>
                </div>

                <div className="lk-timeline-divider"><span>MAY 11</span></div>

                <div className="lk-msg-bubble-group">
                  <img src={`https://i.pravatar.cc/150?img=${activeChat.id + 10}`} alt="" className="lk-msg-bubble-pfp" />
                  <div className="lk-msg-bubble-contents">
                    <h5>{activeChat.name} <span>• 8:37 PM</span></h5>
                    <p>Congrats on the new role!</p>
                  </div>
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