import { useState } from 'react';
import './AdminDashboard.css';

export default function Dashboard() {
  const [filter, setFilter] = useState('24h');
  const [currentPage, setCurrentPage] = useState(1);

  const activities = [
    { id: 1, name: 'Marcus Thorne', action: 'completed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80', statusText: 'Completed', statusClass: 'completed-bg', task: 'HVAC System Diagnostic - Unit #402', time: '12 mins ago' },
    { id: 2, name: 'Elena Rodriguez', action: 'started', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&auto=format&q=80', statusText: 'In Progress', statusClass: 'progress-bg', task: 'Optical Fiber Splicing - Sector 7', time: '45 mins ago' },
    { id: 3, name: 'David Chen', action: 'reported an issue', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop&auto=format&q=80', statusText: 'Alert', statusClass: 'alert-bg', task: 'Main Panel Replacement - Building B', time: '1 hour ago' },
    { id: 4, name: 'Sarah Jenkins', action: 'arrived at location', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&fit=crop&auto=format&q=80', statusText: 'Arrived', statusClass: 'arrived-bg', task: 'Security Camera Installation - Parking Lot', time: '2 hours ago' },
    { id: 5, name: 'James Wilson', action: 'updated progress (75%)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80', statusText: 'In Progress', statusClass: 'progress-bg', task: 'Emergency Generator Repair', time: '3 hours ago' },
    { id: 6, name: 'Alex Martinez', action: 'completed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80', statusText: 'Completed', statusClass: 'completed-bg', task: 'Router Configuration - Server Room C', time: '4 hours ago' }
  ];

  return (
    <div className="dashboard-container">
      {/* Top Metrics Row */}
      <header className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle technicians-bg"><i className="fas fa-users"></i></span>
            <span className="metric-trend trend-up">+3 this month</span>
          </div>
          <p className="metric-label">Total Technicians</p>
          <h2 className="metric-value">42</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle tasks-bg"><i className="fas fa-clipboard-check"></i></span>
            <span className="metric-trend trend-up">+12% vs last week</span>
          </div>
          <p className="metric-label">Total Tasks</p>
          <h2 className="metric-value">1,284</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle progress-circle-bg"><i className="far fa-clock"></i></span>
            <span className="metric-trend trend-down">-2 since 8 AM</span>
          </div>
          <p className="metric-label">In Progress</p>
          <h2 className="metric-value">18</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle completed-circle-bg"><i className="far fa-check-circle"></i></span>
            <span className="metric-trend trend-up">+8 over target</span>
          </div>
          <p className="metric-label">Completed Today</p>
          <h2 className="metric-value">24</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle pending-bg"><i className="fas fa-exclamation-circle"></i></span>
            <span className="status-badge alert-bg">Urgent Attention</span>
          </div>
          <p className="metric-label">Pending Assignment</p>
          <h2 className="metric-value">7</h2>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="main-content-grid">
        {/* Left: Recent Field Activity */}
        <section className="activity-section">
          <div className="section-header">
            <h3>Recent Field Activity</h3>
            <div className="header-actions">
              <div className="select-wrapper filter-select">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <i className="fas fa-chevron-down select-arrow"></i>
              </div>
              <a href="#view-all" className="link-text">View All Activity</a>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="activity-list scrollable-list">
            {activities.map((item) => (
              <div className="activity-item" key={item.id}>
                <img src={item.avatar} alt={item.name} className="avatar" />
                <div className="activity-details">
                  <p><strong>{item.name}</strong> {item.action}</p>
                  <p className="task-desc">
                    <span className={`status-badge ${item.statusClass}`}>{item.statusText}</span>
                    Task: {item.task}
                  </p>
                  <div className="activity-actions">
                    <a href="#status">View Status</a>
                    <a href="#map">Track Map</a>
                  </div>
                </div>
                <span className="timestamp"><i className="far fa-clock"></i> {item.time}</span>
                <button className="btn-icon"><i className="fas fa-ellipsis-v"></i></button>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <footer className="pagination-container">
            <span className="pagination-info">Max 50 items per page</span>
            <div className="pagination-buttons">
              <button
                className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button
                className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>
              <button
                className={`page-btn ${currentPage === 3 ? 'active' : ''}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>
            </div>
          </footer>
        </section>

        {/* Right: Sidebar Controls */}
        <aside className="sidebar-controls">
          <h3>CONTROL CENTER</h3>

          {/* Quick Assign Widget */}
          <div className="widget-card">
            <div className="widget-header-accent">
              <i className="fas fa-bolt text-primary"></i> FAST TRACK
            </div>
            <h4>Quick Assign</h4>
            <p className="widget-subtitle">Dispatch a technician instantly.</p>

            <div className="form-group">
              <label>Task Subject</label>
              <input type="text" placeholder="e.g. Server Maintenance" />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="e.g. Building B, Floor 3" />
            </div>

            <div className="form-group">
              <label>Technician</label>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select available...</option>
                </select>
                <i className="fas fa-chevron-down select-arrow"></i>
              </div>
            </div>

            <button className="btn-primary"><i className="fas fa-plus"></i> Create Task</button>
          </div>

          {/* Weekly Progress Widget */}
          <div className="widget-card progress-widget">
            <div className="progress-header">
              <div>
                <h5>Weekly Goal Progress</h5>
                <h2 className="progress-percentage">82%</h2>
              </div>
              <div className="progress-stats">
                <i className="fas fa-chart-bar font-large"></i>
                <span>342/410 Tasks</span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '82%' }}></div>
            </div>
            <a href="#audit" className="audit-link">Audit Reports <i className="fas fa-arrow-right"></i></a>
          </div>
        </aside>
      </main>
    </div>
  );
}