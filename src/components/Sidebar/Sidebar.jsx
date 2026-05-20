import { useState } from 'react';
import './Sidebar.css';

const SidebarNavigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: 'fas fa-th-large' }, // Using standard FontAwesome grid/dashboard icon
    { name: 'Task', icon: 'far fa-check-square' },
    { name: 'Customers', icon: 'far fa-user', hasArrow: true },
    { name: 'Technician', icon: 'far fa-envelope', hasArrow: true },
    { name: 'Maps', icon: 'far fa-map' },
    { name: 'Chats', icon: 'far fa-comment-alt' },
    { name: 'Analytics', icon: 'fas fa-chart-line', hasArrow: true },
  ];

  return (
    <div className={`sidebar-container ${isExpanded ? 'expanded' : 'contracted'}`}>

      {/* Top Header Section */}
      <div className="sidebar-header">
        {isExpanded ? (
          <div className="user-profile-wrapper">
            <div className="profile-info-block">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Anna George"
                className="avatar-img"
              />
              <div className="text-meta">
                <span className="user-name">Anna George</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            <button className="toggle-close-btn" onClick={() => setIsExpanded(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <div className="contracted-header-wrapper">
            <button className="hamburger-menu-btn" onClick={() => setIsExpanded(true)}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation Tab Links */}
      <nav className="sidebar-nav-links">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              className={`nav-item-row ${isActive ? 'active-link' : ''}`}
              onClick={() => setActiveTab(item.name)}
              title={!isExpanded ? item.name : undefined}
            >
              <div className="nav-icon-box">
                <i className={item.icon}></i>
              </div>

              {isExpanded && (
                <div className="nav-label-content">
                  <span className="label-text">{item.name}</span>
                  {item.hasArrow && <i className="fas fa-chevron-right arrow-indicator"></i>}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Settings Action */}
      <div className="sidebar-footer">
        <button
          className={`nav-item-row settings-row ${activeTab === 'Settings' ? 'active-link' : ''}`}
          onClick={() => setActiveTab('Settings')}
          title={!isExpanded ? 'Settings' : undefined}
        >
          <div className="nav-icon-box settings-icon-wrapper">
            <i className="fas fa-cog"></i>
            {!isExpanded && <span className="notification-blue-dot"></span>}
          </div>
          {isExpanded && (
            <div className="nav-label-content">
              <span className="label-text">Settings</span>
            </div>
          )}
        </button>
      </div>

    </div>
  );
};

export default SidebarNavigation;