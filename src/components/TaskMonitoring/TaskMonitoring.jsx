import { useState } from 'react';
import './TaskMonitoring.css';
import AddTaskModal from './AddTask/AddTaskModal';

export default function TechnikaTasks() {
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const taskStats = [
    { label: 'Total Tasks', value: 12, sub: 'Tasks created this month', change: '+18%', isPositive: true, icon: 'fa-clipboard-list' },
    { label: 'In Progress', value: 4, sub: 'Currently being worked on', change: '-12%', isPositive: false, icon: 'fa-spinner' },
    { label: 'Completed', value: 8, sub: 'Tasks finished this week', change: '+24%', isPositive: true, icon: 'fa-circle-check' },
    { label: 'Pending', value: 2, sub: 'Awaiting technician assignment', change: '+5%', isPositive: false, icon: 'fa-clock' }
  ];

  const initialTasks = [
    { id: 1, name: 'ATM Screen Repair', location: 'GCB Bank - High Street', technician: 'Kwame Mensah', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', priority: 'High', status: 'Pending' },
    { id: 2, name: 'Server Room AC Maintenance', location: 'Ecobank - Silver Star Tower', technician: 'Ama Osei', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', priority: 'Medium', status: 'In Progress' },
    { id: 3, name: 'Vault Security Calibration', location: 'Absa Bank - Accra Financial Centre', technician: 'Kofi Atta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', priority: 'High', status: 'Completed' },
    { id: 4, name: 'Queue Manager Network Patch', location: 'Stanbic Bank - Kwame Nkrumah Avenue', technician: 'Esi Ansah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', priority: 'Low', status: 'In Progress' },
    { id: 5, name: 'CCTV Camera Replacement', location: 'Fidelity Bank - Ridge Head Office', technician: 'Yaw Boakye', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', priority: 'Medium', status: 'Pending' },
    { id: 6, name: 'UPS Battery Bank Auditing', location: 'CalBank - Independence Avenue', technician: 'Afia Kwarteng', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', priority: 'Low', status: 'Completed' },
    { id: 7, name: 'Biometric Access Configuration', location: 'Zenith Bank - Outer Ring Road', technician: 'Kweku Appiah', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop', priority: 'High', status: 'In Progress' }
  ];

  const getPriorityClass = (p) => {
    if (p === 'High') return 'prio-high';
    if (p === 'Medium') return 'prio-med';
    return 'prio-low';
  };

  const getStatusClass = (s) => {
    if (s === 'Completed') return 'stat-done';
    if (s === 'In Progress') return 'stat-progress';
    return 'stat-pending';
  };

  const filteredTasks = initialTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCriteria === 'all') return matchesSearch;
    if (filterCriteria === 'High' || filterCriteria === 'Medium' || filterCriteria === 'Low') {
      return task.priority === filterCriteria && matchesSearch;
    }
    return task.status === filterCriteria && matchesSearch;
  });

  return (
    <div className="technika-tasks-container">
      <header className="tasks-ui-header">
        <div className="header-text-group">
          <h2>Operations Managment</h2>
          <p>Manage and track all your Techncian Tasks</p>
        </div>
        <div className="header-control-buttons">
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass search-field-icon"></i>
            <input
              type="text"
              placeholder="Search task name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tasks-search-field"
            />
          </div>
          <div className="filter-select-wrapper">
            <i className="fa-solid fa-sliders filter-field-icon"></i>
            <select
              className="filter-dropdown-select"
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Pending">Status: Pending</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Completed">Status: Completed</option>
              <option value="High">Priority: High</option>
              <option value="Medium">Priority: Medium</option>
              <option value="Low">Priority: Low</option>
            </select>
          </div>
          <button className="btn-action-primary-green" onClick={() => setIsModalOpen(true)}>
            <span>+ Create</span>
          </button>
        </div>
      </header>

      <section className="tasks-dashboard-cards-grid">
        {taskStats.map((stat, i) => (
          <div key={i} className="task-metric-card-box green-theme-card">
            <div className="card-top-header-row">
              <div className="card-lbl-with-icon">
                <span className="card-emoji-icon">
                  <i className={`fa-solid ${stat.icon}`}></i>
                </span>
                <span className="card-meta-label">{stat.label}</span>
              </div>
            </div>

            <div className="card-central-numerical-row">
              <h3 className="card-main-metric-value">{stat.value}</h3>
              <span className={`card-percentage-badge badge-white-trans`}>
                {stat.change}
              </span>
            </div>
            <p className="card-lower-descriptor-text">{stat.sub}</p>
          </div>
        ))}
      </section>

      <main className="tasks-tabular-data-board">
        <table className="tasks-interactive-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Location</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td className="cell-task-name-text">{task.name}</td>
                <td className="cell-project-hub-text">{task.location}</td>
                <td className="cell-assignee-profile-badge">
                  <div className="assignee-inner-capsule">
                    <img src={task.avatar} alt={task.technician} className="assignee-round-avatar" />
                    <span className="assignee-string-name">{task.technician}</span>
                  </div>
                </td>
                <td>
                  <span className={`priority-pill-tag ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-pill-tag ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="5" className="table-empty-fallback">No tasks match the active filters.</td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="table-pagination-footer-bar">
          <span className="pagination-counter-legend">Showing 1–{filteredTasks.length} of {filteredTasks.length} tasks</span>
          <div className="pagination-navigation-actions-cluster">
            <button className="pagination-arrow-step-btn" disabled>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="pagination-numeric-indicator active-index-highlight">1</button>
            <button className="pagination-arrow-step-btn" disabled>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </footer>
      </main>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}