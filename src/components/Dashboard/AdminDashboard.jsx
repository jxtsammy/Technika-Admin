import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import api from '../../api';

// Maps backend task status to a display label + badge class
const STATUS_DISPLAY = {
  available: { text: 'Pending', statusClass: 'progress-bg' },
  pending: { text: 'In Progress', statusClass: 'progress-bg' },
  completed: { text: 'Completed', statusClass: 'completed-bg' },
};

const technicianName = (assignedTo) =>
  assignedTo && (assignedTo.firstName || assignedTo.lastName)
    ? `${assignedTo.firstName || ''} ${assignedTo.lastName || ''}`.trim()
    : 'Unassigned';

export default function Dashboard() {
  const [filter, setFilter] = useState('24h');
  const [currentPage, setCurrentPage] = useState(1);

  const [technicians, setTechnicians] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTechnicians: 0,
    available: 0,
    pending: 0,
    completed: 0,
    totalTasks: 0,
  });
  const [form, setForm] = useState({ title: '', location: '', assignedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, techRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/users/technicians'),
        api.get('/tasks'),
      ]);

      const techList = techRes.data || [];
      const taskList = tasksRes.data || [];
      const stats = statsRes.data || {};

      const available =
        stats.available ?? taskList.filter((t) => t.status === 'available').length;
      const pending =
        stats.pending ?? taskList.filter((t) => t.status === 'pending').length;
      const completed =
        stats.completed ?? taskList.filter((t) => t.status === 'completed').length;

      setTechnicians(techList);
      setTasks(taskList);
      setMetrics({
        totalTechnicians: techList.length,
        available,
        pending,
        completed,
        totalTasks: available + pending + completed,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    (async () => { await loadData(); })();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.location,
        priority: 'medium',
      };
      if (form.assignedTo) payload.assignedTo = form.assignedTo;

      await api.post('/tasks', payload);
      setForm({ title: '', location: '', assignedTo: '' });
      await loadData();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // 6 most recent tasks for the activity feed
  const recentActivities = tasks.slice(0, 6).map((task) => {
    const display = STATUS_DISPLAY[task.status] || {
      text: task.status,
      statusClass: 'progress-bg',
    };
    return {
      id: task._id,
      name: technicianName(task.assignedTo),
      task: task.title,
      statusText: display.text,
      statusClass: display.statusClass,
      time: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '',
    };
  });

  const completionRate =
    metrics.totalTasks > 0
      ? Math.round((metrics.completed / metrics.totalTasks) * 100)
      : 0;

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
          <h2 className="metric-value">{metrics.totalTechnicians}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle tasks-bg"><i className="fas fa-clipboard-check"></i></span>
            <span className="metric-trend trend-up">+12% vs last week</span>
          </div>
          <p className="metric-label">Total Tasks</p>
          <h2 className="metric-value">{metrics.totalTasks}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle progress-circle-bg"><i className="far fa-clock"></i></span>
            <span className="metric-trend trend-down">-2 since 8 AM</span>
          </div>
          <p className="metric-label">In Progress</p>
          <h2 className="metric-value">{metrics.pending}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle completed-circle-bg"><i className="far fa-check-circle"></i></span>
            <span className="metric-trend trend-up">+8 over target</span>
          </div>
          <p className="metric-label">Completed Today</p>
          <h2 className="metric-value">{metrics.completed}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-circle pending-bg"><i className="fas fa-exclamation-circle"></i></span>
            <span className="status-badge alert-bg">Urgent Attention</span>
          </div>
          <p className="metric-label">Pending Assignment</p>
          <h2 className="metric-value">{metrics.available}</h2>
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
            {recentActivities.map((item) => (
              <div className="activity-item" key={item.id}>
                <img src="https://ui-avatars.com/api/?name=Tech&background=random" alt={item.name} className="avatar" />
                <div className="activity-details">
                  <p><strong>{item.name}</strong></p>
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
              <input
                type="text"
                name="title"
                placeholder="e.g. Server Maintenance"
                value={form.title}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Building B, Floor 3"
                value={form.location}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Technician</label>
              <div className="select-wrapper">
                <select name="assignedTo" value={form.assignedTo} onChange={handleFormChange}>
                  <option value="">Select available...</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.firstName} {tech.lastName}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down select-arrow"></i>
              </div>
            </div>

            <button className="btn-primary" onClick={handleCreateTask} disabled={submitting}>
              <i className="fas fa-plus"></i> {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>

          {/* Weekly Progress Widget */}
          <div className="widget-card progress-widget">
            <div className="progress-header">
              <div>
                <h5>Weekly Goal Progress</h5>
                <h2 className="progress-percentage">{completionRate}%</h2>
              </div>
              <div className="progress-stats">
                <i className="fas fa-chart-bar font-large"></i>
                <span>{metrics.completed}/{metrics.totalTasks} Tasks</span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
            <a href="#audit" className="audit-link">Audit Reports <i className="fas fa-arrow-right"></i></a>
          </div>
        </aside>
      </main>
    </div>
  );
}