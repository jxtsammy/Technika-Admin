import { useEffect } from 'react';
import './Sidebar.css';
import { getStoredUser } from '../../../api/client';

const SidebarNavigation = ({ isExpanded, setIsExpanded, activeTab, setActiveTab }) => {
  const currentUser = getStoredUser();
  const adminName = currentUser
    ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
    : 'Admin';
  const avatarUrl = `https://ui-avatars.com/api/?background=0d9488&color=fff&name=${encodeURIComponent(adminName)}`;

  // Update the browser document title whenever activeTab changes
  useEffect(() => {
    document.title = `TECHNIKA | ${activeTab}`;
  }, [activeTab]);

  const navItems = [
    { name: 'Dashboard', icon: 'fas fa-th-large' },
    { name: 'Task', icon: 'far fa-check-square' },
    { name: 'Customers', icon: 'fa-solid fa-people-group', hasArrow: true },
    { name: 'Technician', icon: 'fa-solid fa-person-biking', hasArrow: true },
    { name: 'Maps', icon: 'far fa-map' },
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
                src={avatarUrl}
                alt={adminName}
                className="avatar-img"
              />
              <div className="text-meta">
                <span className="user-name">{adminName}</span>
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