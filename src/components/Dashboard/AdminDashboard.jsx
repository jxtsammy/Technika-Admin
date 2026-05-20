import { useState } from 'react';
import './AdminDashboard.css';

// Added icon classes to the data mock
const metricsData = [
  { title: 'Total Technicians', value: '42', sub: '+3 this month', isAlert: false, icon: 'fa-users' },
  { title: 'Total Tasks', value: '1,284', sub: '+12% vs last week', isAlert: false, icon: 'fa-clipboard-list' },
  { title: 'In Progress', value: '18', sub: '-2 since 8 AM', isAlert: false, icon: 'fa-clock' },
  { title: 'Completed Today', value: '24', sub: '+8 over target', isAlert: false, icon: 'fa-circle-check' },
  { title: 'Pending Assignment', value: '7', sub: 'Urgent Attention', isAlert: true, icon: 'fa-triangle-exclamation' },
];

const activityData = [
  { id: 1, name: 'Marcus Thorne', action: 'completed', task: 'HVAC System Diagnostic - Unit #402', status: 'Completed', time: '12 mins ago' },
  { id: 2, name: 'Elena Rodriguez', action: 'started', task: 'Optical Fiber Splicing - Sector 7', status: 'In Progress', time: '45 mins ago' },
  { id: 3, name: 'David Chen', action: 'reported an issue', task: 'Main Panel Replacement - Building B', status: 'Alert', time: '1 hour ago' },
  { id: 4, name: 'Sarah Jenkins', action: 'arrived at location', task: 'Security Camera Installation - Parking Lot', status: 'Arrived', time: '2 hours ago' },
  { id: 5, name: 'James Wilson', action: 'updated progress (75%)', task: 'Emergency Generator Repair', status: 'In Progress', time: '3 hours ago' },
];

export default function Dashboard() {
  const [subject, setSubject] = useState('');
  const [tech, setTech] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    setSubject('');
    setTech('');
  };

  return (
    <div className="dashboard-container">

      {/* Top Metrics Row */}
      <div className="metrics-bar">
        {metricsData.map((m, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-card-header">
              <span className={`metric-sub ${m.isAlert ? 'text-alert' : ''}`}>{m.sub}</span>
              <i className={`fa-solid ${m.icon} metric-icon`}></i>
            </div>
            <p className="metric-title">{m.title}</p>
            <h2 className="metric-value">{m.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Content Split Layout */}
      <div className="dashboard-body">

        {/* Left Column: Recent Activity */}
        <div className="main-content">
          <div className="card">
            <div className="card-header">
              <h3>Recent Field Activity</h3>
              <button className="btn-text">View All Activity</button>
            </div>
            <div className="activity-list">
              {activityData.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-avatar">
                    {item.name.charAt(0)}
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>{item.name}</strong> {item.action}
                    </p>
                    <p className="activity-subtext">
                      <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                      Task: {item.task}
                    </p>
                    <div className="activity-links">
                      <button className="link-btn"><i className="fa-solid fa-eye"></i> View Status</button>
                      <button className="link-btn"><i className="fa-solid fa-map-location-dot"></i> Track Map</button>
                    </div>
                  </div>
                  <div className="activity-right">
                    <span className="activity-time">{item.time}</span>
                    <button className="ellipsis-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="sidebar">

          {/* Quick Assign Form */}
          <div className="card control-center">
            <span className="fast-track-label"><i className="fa-solid fa-bolt"></i> FAST TRACK</span>
            <h3>Quick Assign</h3>
            <p className="subtitle">Dispatch a technician instantly.</p>
            <form onSubmit={handleCreateTask}>
              <label>Task Subject</label>
              <input
                type="text"
                placeholder="e.g. Server Maintenance"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <label>Technician</label>
              <div className="select-wrapper">
                <select value={tech} onChange={(e) => setTech(e.target.value)} required>
                  <option value="">Select available...</option>
                  <option value="marcus">Marcus Thorne</option>
                  <option value="elena">Elena Rodriguez</option>
                </select>
                <i className="fa-solid fa-arrow-up-right-from-square select-icon"></i>
              </div>
              <button type="submit" className="btn-submit"><i className="fa-solid fa-plus"></i> Create Task</button>
            </form>
          </div>

          {/* Operational Alerts */}
          <div className="card alerts-card">
            <h3><i className="fa-solid fa-circle-exclamation"></i> Operational Alerts</h3>
            <div className="alert-box">
              <strong>Weather Advisory</strong>
              <p>Heavy rainfall expected in the Northwest sector. Field teams advised to prioritize indoor assignments.</p>
            </div>
            <div className="alert-box">
              <strong>Fleet Update</strong>
              <p>Vehicle maintenance scheduled for Vans #04 and #12 tomorrow at 06:00 AM.</p>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="card weekly-goal">
            <h3>Weekly Goal Progress</h3>
            <div className="goal-metrics">
              <span className="percentage">82%</span>
              <span className="count">342/410 Tasks</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '82%' }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}