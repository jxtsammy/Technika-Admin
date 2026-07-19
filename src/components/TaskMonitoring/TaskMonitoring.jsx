import React, { useState } from 'react';
import './TaskMonitoring.css';

export default function TechnikaTasks() {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const taskStats = [
    { label: 'Total Tasks', value: 12, sub: 'Tasks created this month', change: '+18%', isPositive: true, icon: 'fa-clipboard-list' },
    { label: 'In Progress', value: 4, sub: 'Currently being worked on', change: '-12%', isPositive: false, icon: 'fa-spinner' },
    { label: 'Completed', value: 8, sub: 'Tasks finished this week', change: '+24%', isPositive: true, icon: 'fa-circle-check' },
    { label: 'Overdue', value: 2, sub: 'Missed deadlines', change: '+5%', isPositive: false, icon: 'fa-triangle-exclamation' }
  ];

  const initialTasks = [
    { id: 1, name: 'HVAC Router Installation', system: 'Terminal B Mainframe', technician: 'Jane Cooper', priority: 'Low', status: 'To Do', date: 'Mar 12, 2026' },
    { id: 2, name: 'Fiber Cable Splice Repair', system: 'Grid Sector 4', technician: 'Robert Fox', priority: 'Medium', status: 'To Do', date: 'Mar 13, 2026' },
    { id: 3, name: 'Emergency Generator Diagnostics', system: 'Substation Alpha', technician: 'Eleanor Pena', priority: 'High', status: 'In Progress', date: 'Mar 14, 2026' },
    { id: 4, name: 'Server Rack Power Auditing', system: 'Data Center Row C', technician: 'Guy Hawkins', priority: 'Medium', status: 'In Progress', date: 'Mar 15, 2026' },
    { id: 5, name: 'CCTV Camera Calibration', system: 'Perimeter Wall West', technician: 'Annette Black', priority: 'Medium', status: 'Review', date: 'Mar 16, 2026' },
    { id: 6, name: 'Fire Suppression Inspection', system: 'Chemical Storage Hub', technician: 'Jacob Jones', priority: 'Low', status: 'Review', date: 'Mar 17, 2026' },
    { id: 7, name: 'UPS Battery Module Replacement', system: 'Control Tower Vault', technician: 'Esther Howard', priority: 'High', status: 'Completed', date: 'Mar 18, 2026' }
  ];

  const handleSelectAll = () => {
    const updated = !selectAll;
    setSelectAll(updated);
    const flags = {};
    if (updated) {
      initialTasks.forEach(t => { flags[t.id] = true; });
    }
    setCheckedItems(flags);
  };

  const handleToggleRow = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityClass = (p) => {
    if (p === 'High') return 'prio-high';
    if (p === 'Medium') return 'prio-med';
    return 'prio-low';
  };

  const getStatusClass = (s) => {
    if (s === 'Completed') return 'stat-done';
    if (s === 'In Progress') return 'stat-progress';
    if (s === 'Review') return 'stat-review';
    return 'stat-todo';
  };

  return (
    <div className="technika-tasks-container">

      {/* Top Controls Header */}
      <header className="tasks-ui-header">
        <div className="header-text-group">
          <h2>My Tasks</h2>
          <p>Manage and track all your tasks</p>
        </div>
        <div className="header-control-buttons">
          <button className="icon-search-btn" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="filter-dropdown-btn">
            <span>Filters</span> <i className="fa-solid fa-sliders"></i>
          </button>
          <button className="btn-action-primary-green">
            <span>+ Add Tasks</span>
          </button>
        </div>
      </header>

      {/* Grid Dashboard Metric Cards */}
      <section className="tasks-dashboard-cards-grid">
        {taskStats.map((stat, i) => (
          <div key={i} className="task-metric-card-box">
            <div className="card-top-header-row">
              <div className="card-lbl-with-icon">
                <span className="card-emoji-icon">
                  <i className={`fa-solid ${stat.icon}`}></i>
                </span>
                <span className="card-meta-label">{stat.label}</span>
              </div>
              <button className="card-menu-ellipsis">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>

            <div className="card-central-numerical-row">
              <h3 className="card-main-metric-value">{stat.value}</h3>
              <span className={`card-percentage-badge ${stat.isPositive ? 'badge-up' : 'badge-down'}`}>
                {stat.change}
              </span>
            </div>
            <p className="card-lower-descriptor-text">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* Primary Tabular Registry Canvas */}
      <main className="tasks-tabular-data-board">
        <table className="tasks-interactive-table">
          <thead>
            <tr>
              <th className="cell-checkbox-col">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>Task Name</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th className="cell-actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {initialTasks.map((task) => (
              <tr key={task.id} className={checkedItems[task.id] ? 'row-state-highlighted' : ''}>
                <td className="cell-checkbox-col">
                  <input type="checkbox" checked={!!checkedItems[task.id]} onChange={() => handleToggleRow(task.id)} />
                </td>
                <td className="cell-task-name-text">{task.name}</td>
                <td className="cell-project-hub-text">{task.system}</td>
                <td className="cell-assignee-profile-badge">
                  <div className="assignee-inner-capsule">
                    <div className="assignee-stub-avatar">
                      <i className="fa-solid fa-user-gear"></i>
                    </div>
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
                <td className="cell-date-string-txt">{task.date}</td>
                <td className="cell-actions-col">
                  <button className="row-action-trigger-dots">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Index Controls */}
        <footer className="table-pagination-footer-bar">
          <span className="pagination-counter-legend">Showing 1–10 of 12 tasks</span>
          <div className="pagination-navigation-actions-cluster">
            <button className="pagination-arrow-step-btn" disabled>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="pagination-numeric-indicator active-index-highlight">1</button>
            <button className="pagination-numeric-indicator">2</button>
            <button className="pagination-arrow-step-btn">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}