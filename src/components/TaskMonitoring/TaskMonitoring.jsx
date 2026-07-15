import { useState, useEffect } from 'react';
import './TaskMonitoring.css';
import api from '../../api';

// Import your custom 3D figure fallback asset image here
import Default3DFig from '../../assets/profile.png';

// Maps backend status to the display label used across the monitor
const STATUS_LABEL = {
  available: 'Pending',
  pending: 'In Progress',
  completed: 'Completed',
};

const technicianName = (assignedTo) =>
  assignedTo && (assignedTo.firstName || assignedTo.lastName)
    ? `${assignedTo.firstName || ''} ${assignedTo.lastName || ''}`.trim()
    : 'Unassigned';

export default function TaskMonitor() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  useEffect(() => {
    (async () => { await loadTasks(); })();
    const interval = setInterval(loadTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalActive = tasks.filter(t => t.status === 'pending').length;
  const totalCompleted = tasks.filter(t => t.status === 'completed').length;
  const totalUnassigned = tasks.filter(t => t.status === 'available').length;

  // Attach a display label to each task, then filter by the active tab
  const mappedTasks = tasks.map(task => ({
    ...task,
    displayType: STATUS_LABEL[task.status] || task.status,
  }));

  const filteredTasks = mappedTasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.displayType === statusFilter;
    let matchesTech = true;
    const isActive = task.assignedTo?.isOnline === true;
    if (techFilter === 'Active') matchesTech = isActive === true;
    if (techFilter === 'Inactive') matchesTech = isActive === false;
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
            <span className="service-extra-stat-label">UNASSIGNED</span>
            <h2 className="service-extra-stat-value">{totalUnassigned}</h2>
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
            {['All', 'In Progress', 'Pending', 'Completed'].map((tab) => (
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
          <div key={task._id} className="service-extra-task-card">
            <div className="service-extra-card-header">
              <span className="service-extra-task-id">{task._id.slice(-6).toUpperCase()}</span>
              <span className={`service-extra-status-badge ${task.displayType.toLowerCase().replace(" ", "-")}`}>
                {task.displayType}
              </span>
            </div>

            <h4 className="service-extra-task-title">{task.title}</h4>

            <div className="service-extra-tech-row">
              <div className="service-extra-avatar-box">
                <img
                  src={task.assignedTo?.profilePicture || Default3DFig}
                  alt={technicianName(task.assignedTo)}
                  className="tech-image-file"
                />
                <span className={`service-extra-status-dot ${task.assignedTo?.isOnline ? 'active-green' : 'inactive-yellow'}`}></span>
              </div>
              <div className="service-extra-tech-info">
                <h5>{technicianName(task.assignedTo)}</h5>
                <p>{task.priority}</p>
              </div>
            </div>

            <div className="service-extra-metadata">
              <div className="meta-line">
                <i className="fa-solid fa-location-dot meta-icon"></i> {task.location?.address}
              </div>
              <div className="meta-line">
                <i className="fa-solid fa-clock meta-icon"></i> {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : ''}
              </div>
            </div>

            <button className="service-extra-details-btn">
              View Detailed Updates <i className="fa-solid fa-chevron-right btn-arrow"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}