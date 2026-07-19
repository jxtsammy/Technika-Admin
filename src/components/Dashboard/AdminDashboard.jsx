import { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const dayOfWeekLong = time.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfWeekShort = time.toLocaleDateString('en-US', { weekday: 'short' });
  const dayOfMonth = time.getDate();
  const monthName = time.toLocaleDateString('en-US', { month: 'long' });

  const analyticsData = [
    { day: 'S', type: 'striped' },
    { day: 'M', type: 'solid-green' },
    { day: 'T', type: 'active-mint', label: '74%' },
    { day: 'W', type: 'dark-green' },
    { day: 'T', type: 'striped' },
    { day: 'F', type: 'striped' },
    { day: 'S', type: 'striped' }
  ];

  const assignedTasks = [
    { taskTitle: 'Fix Bill Counter Sensor Error', technicianAssigned: 'Kwame Mensah', color: '#ec4899', icon: '🔧' },
    { taskTitle: 'Onboard Bank Cashier Team', technicianAssigned: 'Abena Osei', color: '#3b82f6', icon: '👥' },
    { taskTitle: 'Deliver 5 Mixed Note Counters', technicianAssigned: 'Kofi Boateng', color: '#0d9488', icon: '📦' },
    { taskTitle: 'Routine Maintenance on Coin Sorter', technicianAssigned: 'Yaw Appiah', color: '#eab308', icon: '⚙️' },
    { taskTitle: 'Calibrate Heavy-Duty Counter', technicianAssigned: 'Esi Ansah', color: '#a855f7', icon: '📐' }
  ];

  return (
    <div className="exact-dashboard-wrapper">
      <header className="exact-header">
        <div className="header-title-block">
          <h1>Dashboard</h1>
          <p>Coordinate field dispatches and dispatch real-time maintenance routes</p>
        </div>

        <div className="header-profile-badge">
          <div className="profile-badge-avatar">
            <span role="img" aria-label="avatar">SS</span>
          </div>
          <div className="profile-badge-details">
            <span className="profile-badge-name">Samuel Sallo</span>
            <span className="profile-badge-email">ssallo1012@gmail.com</span>
          </div>
        </div>
      </header>

      <div className="exact-grid-layout">
        <div className="left-content-segment">
          <div className="exact-metrics-row">
            <div className="m-card focus-green">
              <div className="m-card-header">
                <span className="m-title">Total Technicians</span>
                <span className="m-arrow">↗</span>
              </div>
              <h2 className="m-value">24</h2>
              <div className="m-footer">
                <span className="m-badge">5</span>
                <span className="m-footer-txt">Increased from last month</span>
              </div>
            </div>

            <div className="m-card plain-white">
              <div className="m-card-header">
                <span className="m-title">Total Tasks</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">10</h2>
              <div className="m-footer">
                <span className="m-badge dark">6</span>
                <span className="m-footer-txt">Increased from last month</span>
              </div>
            </div>

            <div className="m-card plain-white">
              <div className="m-card-header">
                <span className="m-title">Completed Today</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">12</h2>
              <div className="m-footer">
                <span className="m-badge dark">2</span>
                <span className="m-footer-txt">Increased from last month</span>
              </div>
            </div>

            <div className="m-card plain-white">
              <div className="m-card-header">
                <span className="m-title">Pending Assignment</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">2</h2>
              <div className="m-footer">
                <span className="m-footer-txt status-only">On Discuss</span>
              </div>
            </div>
          </div>

          <div className="middle-split-row">
            <div className="panel-card flex-60">
              <h3>Work Analytics</h3>
              <div className="analytics-pill-chart spaced-graph">
                {analyticsData.map((item, idx) => (
                  <div key={idx} className="pill-chart-col">
                    <div className="pill-bar-track">
                      <div className={`pill-bar-fill ${item.type}`}>
                        {item.label && (
                          <div className="pill-floating-tooltip">
                            {item.label}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="pill-axis-lbl">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-card flex-40 design-date-card centered-layout">
              <h3>Date</h3>
              <div className="date-card-body">
                <h1 className="date-large-day">{dayOfWeekShort}</h1>
                <p className="date-sub-details">{dayOfMonth} {monthName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-sidebar-segment">
          <div className="panel-card full-height-card dashboard-tasks-card">
            <div className="panel-header-with-btn">
              <h3>Assigned Tasks</h3>
            </div>

            <div className="sidebar-project-list tasks-container-wrapper">
              {assignedTasks.length === 0 ? (
                <div className="no-tasks-placeholder">
                  <i className="fa-regular fa-clipboard"></i>
                  <p>No Tasks Assigned</p>
                </div>
              ) : (
                assignedTasks.map((task, idx) => (
                  <div key={idx} className="sidebar-proj-row">
                    <div className="proj-icon-box" style={{ background: `${task.color}20`, color: task.color, padding: '8px', borderRadius: '50%' }}>
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="proj-metadata">
                      <h4>{task.taskTitle}</h4>
                      <p>Assigned to: <span>{task.technicianAssigned}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel-card abstract-time-tracker">
            <h3>Time Tracker</h3>
            <div className="tracker-row-elements">
              <h2>{timeString}</h2>
              <div className="tracker-day-display">
                {dayOfWeekLong}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}