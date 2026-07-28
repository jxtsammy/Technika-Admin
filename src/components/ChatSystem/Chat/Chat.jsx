import { useState, useRef, useEffect, useCallback } from 'react';
import './Chat.css';
import { chatsApi, usersApi, fullName } from '../../../api/services';
import { getStoredUser } from '../../../api/client';

const AVATAR_BASE =
  'https://ui-avatars.com/api/?background=dbeafe&color=1d4ed8&name=';

// Refresh conversations/messages every 10s while the widget is open
const CHAT_POLL_MS = 10000;

const avatarFor = (user) =>
  user?.profilePicture || `${AVATAR_BASE}${encodeURIComponent(fullName(user) || 'User')}`;

function formatChatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Chat() {
  const currentUser = getStoredUser();
  const myId = currentUser?._id;

  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [filterType, setFilterType] = useState('name');

  // Local-only chat flags (archive/star are not supported by the backend)
  const [localFlags, setLocalFlags] = useState({});

  // New Message Mode states
  const [isNewMessageMode, setIsNewMessageMode] = useState(false);
  const [newUserSearch, setNewUserSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messageAreaRef = useRef(null);

  // Map a backend chat doc into the row shape used by this widget
  const toChatRow = useCallback(
    (chat) => {
      const other =
        chat.participants.find((p) => p._id !== myId) || chat.participants[0];
      const flags = localFlags[chat._id] || {};
      return {
        id: chat._id,
        name: fullName(other) || 'Unknown user',
        otherUser: other,
        role: '',
        lastMsg: chat.lastMessage ? chat.lastMessage.content : 'No messages yet',
        date: formatChatDate(chat.lastMessage?.createdAt || chat.updatedAt),
        unread: false,
        favourite: !!flags.favourite,
        archived: !!flags.archived,
        deleted: !!flags.deleted,
      };
    },
    [myId, localFlags]
  );

  // Load conversations (and poll while open)
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const load = async () => {
      try {
        const data = await chatsApi.list();
        if (!cancelled) setChats(data);
      } catch (err) {
        console.error('Failed to load chats:', err.message);
      }
    };

    load();
    const timer = setInterval(load, CHAT_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [isOpen]);

  // Load users for the "new message" search (admins chat with technicians)
  useEffect(() => {
    if (!isNewMessageMode) return;
    usersApi
      .getTechnicians()
      .then(setAllUsers)
      .catch(() => setAllUsers([]));
  }, [isNewMessageMode]);

  // Load messages for the open conversation (and poll)
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const data = await chatsApi.messages(activeChat.id);
        if (!cancelled) setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err.message);
      }
    };

    load();
    const timer = setInterval(load, CHAT_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [activeChat]);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [activeChat, messages]);

  const chatRows = chats.map(toChatRow).filter((c) => !c.deleted);

  // Tab Filtering & Main Search Logic
  const processedChats = chatRows.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'Unread' && !chat.unread) return false;
    if (activeTab === 'Archived' && !chat.archived) return false;
    if (activeTab === 'Favourite' && !chat.favourite) return false;

    // Explicit Rule: All tab displays everything except archived chats
    if (activeTab === 'All' && chat.archived) return false;

    return matchesSearch;
  });

  // Filter system users for the New Message search engine
  const filteredNewUsers = allUsers.filter(user =>
    fullName(user).toLowerCase().includes(newUserSearch.toLowerCase())
  );

  // Archive/star/delete are UI-only conveniences (no backend support yet)
  const handleAction = (id, action) => {
    setLocalFlags(prev => {
      const flags = prev[id] || {};
      if (action === 'archive') return { ...prev, [id]: { ...flags, archived: !flags.archived } };
      if (action === 'star') return { ...prev, [id]: { ...flags, favourite: !flags.favourite } };
      if (action === 'delete') return { ...prev, [id]: { ...flags, deleted: true } };
      return prev;
    });
    setActiveMenuId(null);
  };

  const handleSendMessage = async () => {
    if (!typedMessage.trim() || !activeChat || sending) return;
    const content = typedMessage.trim();
    setSending(true);
    try {
      const sent = await chatsApi.send(activeChat.id, content);
      setMessages(prev => [...prev, sent]);
      setTypedMessage('');
      // Refresh conversation previews
      chatsApi.list().then(setChats).catch(() => {});
    } catch (err) {
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleSelectUserForNewMessage = async (user) => {
    try {
      const chat = await chatsApi.createOrGet(user._id);
      setChats(prev => {
        const exists = prev.some(c => c._id === chat._id);
        return exists ? prev : [chat, ...prev];
      });
      setActiveChat(toChatRow(chat));
      setIsNewMessageMode(false);
      setNewUserSearch('');
    } catch (err) {
      alert(`Failed to start chat: ${err.message}`);
    }
  };

  const myAvatar = `${AVATAR_BASE}${encodeURIComponent(fullName(currentUser) || 'Admin')}`;

  return (
    <div className={`lk-chat-widget ${isOpen ? 'is-open' : 'is-closed'} ${activeChat ? 'is-viewing-chat' : ''}`}>

      {/* --- CHAT HUB CORE HEADER --- */}
      <div className="lk-chat-header" onClick={() => { if (!activeChat) { setIsOpen(!isOpen); setIsNewMessageMode(false); } }}>
        <div className="lk-header-left">
          <div className="lk-avatar-container">
            <img src={myAvatar} alt="Me" className="lk-user-pfp" />
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
                    <p>No technicians found matching "{newUserSearch}"</p>
                  </div>
                ) : (
                  filteredNewUsers.map(user => (
                    <div key={user._id} className="lk-new-user-row-item" onClick={() => handleSelectUserForNewMessage(user)}>
                      <img src={avatarFor(user)} alt="" className="lk-new-user-avatar" />
                      <div className="lk-new-user-details">
                        <h5>{fullName(user)}</h5>
                        <p>{user.isOnline ? 'Online' : 'Offline'} · Technician</p>
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
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tab Elements */}
              <div className="lk-tabs-bar">
                {['All', 'Archived', 'Favourite'].map(tab => (
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
                        <img src={avatarFor(chat.otherUser)} alt={chat.name} className="lk-item-pfp" />
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
                                {/* Dynamic toggle label changes back and forth between Archive and Unarchive */}
                                <div onClick={() => handleAction(chat.id, 'archive')}>
                                  <i className="fa-regular fa-folder-open"></i>
                                  {chat.archived ? 'Unarchive' : 'Archive'}
                                </div>

                                <div onClick={() => handleAction(chat.id, 'star')}><i className="fa-regular fa-star"></i> {chat.favourite ? 'Unstar' : 'Star Favourite'}</div>
                                <div onClick={() => handleAction(chat.id, 'delete')} className="danger-action"><i className="fa-regular fa-trash-can"></i> Hide Conversation</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="lk-item-msg-preview">{chat.lastMsg}</p>
                      </div>
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
                    <span className="lk-detail-status">
                      {activeChat.otherUser?.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="lk-detail-header-right">
                  <button className="lk-icon-btn"><i className="fa-solid fa-ellipsis"></i></button>
                  <button className="lk-icon-btn" onClick={() => setActiveChat(null)}><i className="fa-solid fa-xmark"></i></button>
                </div>
              </div>

              <div className="lk-messages-timeline" ref={messageAreaRef}>
                <div className="lk-user-intro-card">
                  <img src={avatarFor(activeChat.otherUser)} alt={activeChat.name} className="lk-intro-avatar" />
                  <h3>{activeChat.name}</h3>
                  <p>Technician</p>
                </div>

                {messages.map(msg => {
                  const isMine = msg.sender?._id === myId;
                  return (
                    <div key={msg._id} className={`lk-msg-bubble-group ${isMine ? 'outgoing' : ''}`}>
                      {!isMine && (
                        <img src={avatarFor(msg.sender)} alt="" className="lk-msg-bubble-pfp" />
                      )}
                      <div className="lk-msg-bubble-contents">
                        <h5>
                          {isMine ? 'You' : fullName(msg.sender)}{' '}
                          <span>• {formatChatDate(msg.createdAt)}</span>
                        </h5>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <div className="lk-timeline-divider"><span>No messages yet — say hello!</span></div>
                )}
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

                {/* Toolbar Context */}
                <div className="lk-composer-toolbar">
                  <div className="lk-toolbar-left-actions"></div>

                  <div className="lk-toolbar-right-actions">
                    <span className="lk-submit-tip-label">{sending ? 'Sending…' : 'Press Enter to Send'}</span>
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
