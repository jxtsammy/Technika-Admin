import { useEffect, useMemo, useState } from 'react';
import './AnalyticsView.css';
import api from '../../api';

// Maps backend status values to the display labels used by the badges/filter
const STATUS_LABELS = {
  completed: 'Completed',
  pending: 'In Progress',
  available: 'Pending',
};

const techName = (user) =>
  user && (user.firstName || user.lastName)
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : 'Unassigned';

const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const formatDuration = (task) => {
  if (!task.acknowledgedAt || !task.completedAt) return '—';
  const mins = Math.round((new Date(task.completedAt) - new Date(task.acknowledgedAt)) / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatMinutes = (mins) => {
  if (!mins) return '—';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

export default function AnalyticsView() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksRes, statsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/tasks/stats'),
        ]);
        setTasks(tasksRes.data || []);
        setStats(statsRes.data || null);
      } catch (err) {
        console.error('Failed to load analytics data:', err);
        setLoadError(err.response?.data?.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const technicianNames = useMemo(() => {
    const names = new Set();
    tasks.forEach((t) => {
      if (t.assignedTo) names.add(techName(t.assignedTo));
    });
    return [...names].sort();
  }, [tasks]);

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedTech('All');
    setSelectedStatus('All Statuses');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredTasks = tasks.filter((task) => {
    const statusLabel = STATUS_LABELS[task.status] || task.status;
    const name = techName(task.assignedTo);
    const matchesTech = selectedTech === 'All' || name === selectedTech;
    const matchesStatus = selectedStatus === 'All Statuses' || statusLabel === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      task._id.toLowerCase().includes(q) ||
      (task.title || '').toLowerCase().includes(q) ||
      (task.description || '').toLowerCase().includes(q);
    const created = task.createdAt ? new Date(task.createdAt) : null;
    const matchesStart = !startDate || (created && created >= new Date(startDate));
    const matchesEnd = !endDate || (created && created <= new Date(`${endDate}T23:59:59`));
    return matchesTech && matchesStatus && matchesSearch && matchesStart && matchesEnd;
  });

  const totalRecords = filteredTasks.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const currentRecords = filteredTasks.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const totalCompleted = stats?.completed ?? 0;
  const totalAll = (stats?.completed ?? 0) + (stats?.pending ?? 0) + (stats?.available ?? 0);
  const openRate = totalAll > 0 ? Math.round(((totalAll - totalCompleted) / totalAll) * 100) : 0;

  return (
    <div className="analytics-container">
      {/* Top Banner Row */}
      <header className="analytics-header">
        <div className="header-meta">
          <h1>Operational History</h1>
          <p>Track tactical workflow metrics and archived technician records.</p>
        </div>
      </header>

      {loadError && <p style={{ color: '#c0392b' }}>{loadError}</p>}

      {/* Modern Data Card Grid */}
      <section className="metrics-dashboard-grid">
        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Total Completed</span>
            <div className="icon-badge complete-bg"><i className="fas fa-check-circle"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{loading ? '…' : totalCompleted.toLocaleString()}</h2>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Avg. Completion Time</span>
            <div className="icon-badge time-bg"><i className="fas fa-clock"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{loading ? '…' : formatMinutes(stats?.averageCompletionMinutes)}</h2>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Open Task Rate</span>
            <div className="icon-badge error-bg"><i className="fas fa-exclamation-triangle"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{loading ? '…' : `${openRate}%`}</h2>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Total Tasks</span>
            <div className="icon-badge distance-bg"><i className="fas fa-layer-group"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{loading ? '…' : totalAll.toLocaleString()}</h2>
          </div>
        </div>
      </section>

      {/* Refined Filter Module */}
      <section className="filter-panel-card">
        <div className="panel-section-title">
          <i className="fas fa-sliders-h"></i>
          <span>Advanced Filter Controls</span>
        </div>

        <div className="filter-inputs-grid">
          <div className="filter-field-wrapper">
            <label>Date Range</label>
            <div className="date-range-split-input">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="range-to-indicator">to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="filter-field-wrapper">
            <label>Technician Assignment</label>
            <div className="select-dropdown-style">
              <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)}>
                <option value="All">All Technicians</option>
                {technicianNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field-wrapper">
            <label>Task Status</label>
            <div className="select-dropdown-style">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="All Statuses">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-footer-actions">
          <button className="btn-clear-filters" onClick={handleReset}>
            <i className="fas fa-eraser"></i> Clear Settings
          </button>
        </div>
      </section>

      {/* Main Data Repository Block */}
      <section className="data-table-card">
        <div className="data-table-header-row">
          <div className="panel-section-title">
            <i className="fas fa-layer-group"></i>
            <span>Operational Log Archives</span>
          </div>
          <div className="search-field-housing">
            <i className="fas fa-search search-embed-icon"></i>
            <input
              type="text"
              placeholder="Search by ID or task title keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-viewport-scroller">
          <table className="custom-dashboard-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task Description</th>
                <th>Assigned Technician</th>
                <th>Deployment Location</th>
                <th>Completed At</th>
                <th>Total Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading tasks…</td></tr>
              ) : currentRecords.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No tasks found</td></tr>
              ) : currentRecords.map((task) => {
                const statusLabel = STATUS_LABELS[task.status] || task.status;
                const name = techName(task.assignedTo);
                return (
                  <tr key={task._id}>
                    <td className="styled-id-string">{task._id.slice(-6).toUpperCase()}</td>
                    <td className="styled-desc-paragraph">{task.title}</td>
                    <td>
                      <div className="avatar-chip-container">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} alt="" />
                        <span>{name}</span>
                      </div>
                    </td>
                    <td className="styled-location-text">
                      <i className="fas fa-map-marker-alt location-marker-dot"></i> {task.location?.address || '—'}
                    </td>
                    <td className="timestamp-data-cell">{formatDateTime(task.completedAt)}</td>
                    <td className="duration-data-cell">{formatDuration(task)}</td>
                    <td>
                      <span className={`pill-status badge-${statusLabel.toLowerCase().replace(' ', '-')}`}>
                        <span className="status-bullet-dot"></span>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic 5-Item Pagination Segment Footnote */}
        <div className="table-pagination-footer-bar">
          <span className="pagination-narrative-summary">
            Showing <b>{totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1}</b> to <b>{Math.min(currentPage * recordsPerPage, totalRecords)}</b> of <b>{totalRecords}</b> entries
          </span>
          <div className="pagination-interactive-nodes">
            <button className="pag-nav-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <div className="active-page-badge">Page {currentPage} of {totalPages}</div>
            <button className="pag-nav-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
