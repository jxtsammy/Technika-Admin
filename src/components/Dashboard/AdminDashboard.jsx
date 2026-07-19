
import './AdminDashboard.css';

export default function Dashboard({ onNavigate }) {
  // Hardcoded date based on system state: Sunday, July 19, 2026
  const currentDayNameShort = 'Sun';
  const currentDayLong = 'Sunday';
  const currentDayAndMonth = '19 July';
  const currentTimeString = '01:19:28';

  const analyticsData = [
    { day: 'S', type: 'striped' },
    { day: 'M', type: 'solid-green' },
    { day: 'T', type: 'active-mint', label: '74%' },
    { day: 'W', type: 'dark-green' },
    { day: 'T', type: 'striped' },
    { day: 'F', type: 'striped' },
    { day: 'S', type: 'striped' }
  ];

  const activeTechnicians = [
    { name: 'Kwame Mensah', task: 'Repairing main generator unit at Downtown Hub A', initial: 'KM', color: '#f87171' },
    { name: 'Ama Osei', task: 'Deploying security credentials layer onto core switch', initial: 'AO', color: '#4ade80' },
    { name: 'Kofi Boateng', task: 'Calibrating backup transceiver nodes', initial: 'KB', color: '#60a5fa' },
    { name: 'Abena Asare', task: 'Running responsive diagnostic protocols', initial: 'AA', color: '#fb923c' }
  ];

  const activeTasks = [
    { tech: 'Kwame Mensah', task: 'Generator Calibration', initial: 'KM', color: '#f87171' },
    { tech: 'Ama Osei', task: 'Security Authentication Update', initial: 'AO', color: '#4ade80' },
    { tech: 'Kofi Boateng', task: 'Transceiver Diagnostic Hub', initial: 'KB', color: '#60a5fa' }
  ];

  const sidebarProjects = [
    { name: 'Develop API Endpoints', date: 'Nov 26, 2024', color: '#3b82f6', icon: '⚡' },
    { name: 'Onboarding Flow', date: 'Nov 28, 2024', color: '#0d9488', icon: '💠' },
    { name: 'Build Dashboard', date: 'Nov 30, 2024', color: '#a855f7', icon: '✢' },
    { name: 'Optimize Page Load', date: 'Dec 5, 2024', color: '#eab308', icon: '📐' },
    { name: 'Cross-Browser Testing', date: 'Dec 6, 2024', color: '#ec4899', icon: '🔮' }
  ];

  return (
    <div className="exact-dashboard-wrapper">

      {/* Top Header Row */}
      <header className="exact-header">
        <div className="header-title-block">
          <h1>Dashboard</h1>
          <p>Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="header-actions-block">
          {/* Functional tab switching placeholders using the layout controls */}
          <button className="btn-add-project" onClick={() => onNavigate?.('map-tracking')}>
            Map Tracking
          </button>
          <button className="btn-import-data" onClick={() => onNavigate?.('tasks')}>
            Tasks
          </button>
        </div>
      </header>

      {/* Primary Layout Grid */}
      <div className="exact-grid-layout">

        {/* Left Segment Flow */}
        <div className="left-content-segment">

          {/* Top Row: 4 Metric Cards */}
          <div className="exact-metrics-row">
            <div className="m-card focus-green">
              <div className="m-card-header">
                <span className="m-title">Total Projects</span>
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
                <span className="m-title">Ended Projects</span>
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
                <span className="m-title">Running Projects</span>
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
                <span className="m-title">Pending Project</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">2</h2>
              <div className="m-footer">
                <span className="m-footer-txt status-only">On Discuss</span>
              </div>
            </div>
          </div>

          {/* Middle Row: Project Analytics & Current Date Card Split */}
          <div className="middle-split-row">
            <div className="panel-card flex-60">
              <h3>Project Analytics</h3>
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

            <div className="panel-card flex-40 design-date-card">
              <h3>Date</h3>
              <div className="date-card-body">
                <h1 className="date-large-day">{currentDayNameShort}</h1>
                <p className="date-sub-details">{currentDayAndMonth}</p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Active Technicians & Active Tasks */}
          <div className="bottom-split-row">
            <div className="panel-card flex-60">
              <div className="panel-header-with-btn">
                <h3>Active Technicians</h3>
              </div>
              <div className="collab-rows-list">
                {activeTechnicians.map((person, idx) => (
                  <div key={idx} className="collab-item-row">
                    <div className="collab-left-meta">
                      <div className="collab-avatar" style={{ backgroundColor: person.color }}>
                        {person.initial}
                      </div>
                      <div className="collab-naming">
                        <h5>{person.name}</h5>
                        <p>{person.task}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-card flex-40">
              <h3>Active Tasks</h3>
              <div className="active-tasks-list">
                {activeTasks.map((taskItem, idx) => (
                  <div key={idx} className="active-task-item-row">
                    <div className="task-profile-circle" style={{ backgroundColor: taskItem.color }}>
                      {taskItem.initial}
                    </div>
                    <div className="task-meta-details">
                      <h4>{taskItem.tech}</h4>
                      <p>{taskItem.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Segment Flow */}
        <div className="right-sidebar-segment">
          <div className="panel-card full-height-card">
            <div className="panel-header-with-btn">
              <h3>Project</h3>
              <button className="btn-panel-action">+ New</button>
            </div>
            <div className="sidebar-project-list">
              {sidebarProjects.map((proj, idx) => (
                <div key={idx} className="sidebar-proj-row">
                  <div className="proj-icon-box" style={{ color: proj.color }}>
                    {proj.icon}
                  </div>
                  <div className="proj-metadata">
                    <h4>{proj.name}</h4>
                    <p>Due date: <span>{proj.date}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card abstract-time-tracker">
            <h3>Time Tracker</h3>
            <div className="tracker-row-elements">
              <h2>{currentTimeString}</h2>
              <div className="tracker-day-display">
                {currentDayLong}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}