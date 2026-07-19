import { useState } from 'react';
import './TaskMonitoring.css';

// Import your custom 3D figure fallback asset image here
import Default3DFig from '../../assets/profile.png';

const INITIAL_TASKS = [
  { id: "T-1001", title: "HVAC System Maintenance - Block A", type: "In Progress", techName: "Marcus Chen", role: "Senior Technician", location: "North Industrial Park, Sector 4", updated: "Updated 4 mins ago", active: true, img: "" },
  { id: "T-1002", title: "Electrical Panel Inspection", type: "Pending", techName: "Sarah Jenkins", role: "Electrical Specialist", location: "Heritage Mall, Level 2", updated: "Updated 22 mins ago", active: false, img: "" },
  { id: "T-1003", title: "Fiber Optic Cable Repair", type: "Completed", techName: "David Wilson", role: "Network Engineer", location: "Corporate Plaza, West Wing", updated: "Updated 1 hour ago", active: false, img: "" },
  { id: "T-1004", title: "Emergency Generator Testing", type: "In Progress", techName: "Elena Rodriguez", role: "Mechanical Tech", location: "City General Hospital", updated: "Updated 12 mins ago", active: true, img: "" },
  { id: "T-1005", title: "Water Filtration Filter Swap", type: "Delayed", techName: "Robert Taylor", role: "Plumbing Expert", location: "Green Valley Apartments", updated: "Updated 45 mins ago", active: false, img: "" },
  { id: "T-1006", title: "Security Camera Calibration", type: "In Progress", techName: "Aisha Khan", role: "System Integrator", location: "Downtown Public Library", updated: "Updated Just now", active: true, img: "" }
];

export default function TaskMonitor() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const totalActive = INITIAL_TASKS.filter(t => t.type === 'In Progress').length;
  const totalCompleted = INITIAL_TASKS.filter(t => t.type === 'Completed').length;
  const totalDelayed = INITIAL_TASKS.filter(t => t.type === 'Delayed').length;

  const filteredTasks = INITIAL_TASKS.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.type.toLowerCase() === statusFilter.toLowerCase();
    let matchesTech = true;
    if (techFilter === 'Active') matchesTech = task.active === true;
    if (techFilter === 'Inactive') matchesTech = task.active === false;
    return matchesStatus && matchesTech;
  });

  return (
    <div className="service-extra-monitor-container">
      {/* Top Cards Section */}
      <div className="service-extra-stats-grid">
        <div className="service-extra-stat-card">
          <div className="service-extra-stat-icon active-icon">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <div>
            <span className="service-extra-stat-label">ACTIVE TASKS</span>
            <h2 className="service-extra-stat-value">{totalActive}</h2>
          </div>
        </div>
        <div className="service-extra-stat-card">
          <div className="service-extra-stat-icon completed-icon">
            <i className="fa-solid fa-check"></i>
          </div>
          <div>
            <span className="service-extra-stat-label">COMPLETED TODAY</span>
            <h2 className="service-extra-stat-value">{totalCompleted}</h2>
          </div>
        </div>
        <div className="service-extra-stat-card">
          <div className="service-extra-stat-icon delayed-icon">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <span className="service-extra-stat-label">DELAYED</span>
            <h2 className="service-extra-stat-value">{totalDelayed}</h2>
          </div>
        </div>
      </div>

      {/* Control Header Row */}
      <div className="service-extra-control-header">
        <div className="service-extra-title-group">
          <h3>Real-time Tasks ({filteredTasks.length})</h3>
          <span className="service-extra-live-indicator">● Auto-updating every 30s</span>
        </div>

        <div className="service-extra-filter-controls">
          <div className="service-extra-tabs-row">
            {['All', 'In Progress', 'Pending', 'Delayed'].map((tab) => (
              <button
                key={tab}
                className={`service-extra-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Criteria Dropdown Trigger */}
          <div className="service-extra-dropdown-wrapper">
            <button
              className={`service-extra-icon-btn ${techFilter !== 'All' ? 'filter-engaged' : ''}`}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <i className="fa-solid fa-filter"></i>
            </button>

            {showFilterDropdown && (
              <div className="service-extra-filter-dropdown">
                <div className="dropdown-title">Technician Status</div>
                <button className={techFilter === 'All' ? 'selected' : ''} onClick={() => { setTechFilter('All'); setShowFilterDropdown(false); }}>All Technicians</button>
                <button className={techFilter === 'Active' ? 'selected' : ''} onClick={() => { setTechFilter('Active'); setShowFilterDropdown(false); }}>🟢 Active Only</button>
                <button className={techFilter === 'Inactive' ? 'selected' : ''} onClick={() => { setTechFilter('Inactive'); setShowFilterDropdown(false); }}>🟡 Inactive Only</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards Grid Layout */}
      <div className="service-extra-tasks-grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className="service-extra-task-card">
            <div className="service-extra-card-header">
              <span className="service-extra-task-id">{task.id}</span>
              <span className={`service-extra-status-badge ${task.type.toLowerCase().replace(" ", "-")}`}>
                {task.type}
              </span>
            </div>

            <h4 className="service-extra-task-title">{task.title}</h4>

            <div className="service-extra-tech-row">
              <div className="service-extra-avatar-box">
                <img
                  src={task.img || Default3DFig}
                  alt={task.techName}
                  className="tech-image-file"
                />
                <span className={`service-extra-status-dot ${task.active ? 'active-green' : 'inactive-yellow'}`}></span>
              </div>
              <div className="service-extra-tech-info">
                <h5>{task.techName}</h5>
                <p>{task.role}</p>
              </div>
            </div>

            <div className="service-extra-metadata">
              <div className="meta-line">
                <i className="fa-solid fa-location-dot meta-icon"></i> {task.location}
              </div>
              <div className="meta-line">
                <i className="fa-solid fa-clock meta-icon"></i> {task.updated}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}