import { useState, useEffect, useMemo } from 'react';
import './AnalyticsView.css';
import OperationReportModal from './OperationsReport/ReportModal';
import { tasksApi, fullName, capitalize } from '../../api/services';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=e2e8f0&color=475569&name=';

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-CA')} ${d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
}

function formatDuration(startIso, endIso) {
  if (!startIso || !endIso) return '—';
  const mins = Math.round((new Date(endIso) - new Date(startIso)) / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// Map a completed backend task into the archive-row shape
function toArchiveRow(task) {
  const techName = task.assignedTo ? fullName(task.assignedTo) : 'Unassigned';
  return {
    id: task._id,
    shortId: `TK-${task._id.slice(-4).toUpperCase()}`,
    desc: task.title,
    tech: techName,
    avatar: `${DEFAULT_AVATAR}${encodeURIComponent(techName)}`,
    location: task.location?.address || task.companyName || '—',
    completedAtRaw: task.completedAt,
    completedAt: formatDateTime(task.completedAt),
    duration: formatDuration(task.acknowledgedAt, task.completedAt),
    status: 'Completed',
    companyName: task.companyName || '—',
    clientPhone: task.callerPhone || '—',
    operationTitle: task.title,
    priorityLevel: capitalize(task.priority),
    summary: task.completionNote || 'No completion note was provided by the technician.',
    photoEvidences: [],
  };
}

export default function AnalyticsView() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [stats, setStats] = useState({ completed: 0, averageCompletionMinutes: 0 });
  const [loading, setLoading] = useState(true);

  // Action Menu & Modal States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);

  const recordsPerPage = 5;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [tasks, taskStats] = await Promise.all([
          tasksApi.list(),
          tasksApi.stats(),
        ]);
        if (cancelled) return;
        setArchivedTasks(
          tasks.filter((t) => t.status === 'completed').map(toArchiveRow)
        );
        setStats(taskStats);
      } catch (err) {
        console.error('Failed to load operational history:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const technicianOptions = useMemo(
    () => [...new Set(archivedTasks.map((t) => t.tech))],
    [archivedTasks]
  );

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedTech('All');
    setSelectedStatus('All Statuses');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredTasks = archivedTasks.filter(task => {
    const matchesTech = selectedTech === 'All' || task.tech === selectedTech;
    const matchesStatus = selectedStatus === 'All Statuses' || task.status === selectedStatus;
    const matchesSearch = task.shortId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.desc.toLowerCase().includes(searchQuery.toLowerCase());
    // Date-range filter on completion date
    const completedTime = task.completedAtRaw ? new Date(task.completedAtRaw).getTime() : null;
    const matchesStart = !startDate || (completedTime !== null && completedTime >= new Date(startDate).getTime());
    const matchesEnd = !endDate || (completedTime !== null && completedTime <= new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1);
    return matchesTech && matchesStatus && matchesSearch && matchesStart && matchesEnd;
  });

  const avgMinutes = stats.averageCompletionMinutes || 0;
  const avgTimeDisplay =
    avgMinutes >= 60
      ? `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`
      : `${avgMinutes}m`;

  const totalRecords = filteredTasks.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const currentRecords = filteredTasks.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const toggleActionMenu = (taskId, e) => {
    e.stopPropagation();
    setActiveMenuId(prev => (prev === taskId ? null : taskId));
  };

  const handleOpenReport = (task) => {
    const reportIndex = filteredTasks.findIndex(t => t.id === task.id);
    setSelectedReportIndex(reportIndex >= 0 ? reportIndex : 0);
    setActiveMenuId(null);
    setIsReportModalOpen(true);
  };

  const currentReportData = filteredTasks[selectedReportIndex] ? {
    technicianName: filteredTasks[selectedReportIndex].tech,
    technicianAvatar: filteredTasks[selectedReportIndex].avatar,
    operationTitle: filteredTasks[selectedReportIndex].operationTitle,
    operationDescription: filteredTasks[selectedReportIndex].desc,
    priorityLevel: filteredTasks[selectedReportIndex].priorityLevel,
    companyName: filteredTasks[selectedReportIndex].companyName,
    operationLocation: filteredTasks[selectedReportIndex].location,
    clientPhone: filteredTasks[selectedReportIndex].clientPhone,
    summary: filteredTasks[selectedReportIndex].summary,
    photoEvidences: filteredTasks[selectedReportIndex].photoEvidences
  } : null;

  return (
    <div className="analytics-container" onClick={() => setActiveMenuId(null)}>
      {/* Top Banner Row */}
      <header className="analytics-header">
        <div className="header-meta">
          <h1>Operational History</h1>
          <p>Track tactical workflow metrics and archived technician records.</p>
        </div>
      </header>

      {/* Modern Data Card Grid */}
      <section className="metrics-dashboard-grid">
        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Total Completed</span>
            <div className="icon-badge complete-bg"><i className="fas fa-check-circle"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{stats.completed}</h2>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Avg. Completion Time</span>
            <div className="icon-badge time-bg"><i className="fas fa-clock"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{avgTimeDisplay}</h2>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">In Progress</span>
            <div className="icon-badge error-bg"><i className="fas fa-exclamation-triangle"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{stats.pending ?? 0}</h2>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Awaiting Start</span>
            <div className="icon-badge distance-bg"><i className="fas fa-route"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>{stats.available ?? 0}</h2>
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
                {technicianOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field-wrapper">
            <label>Archived Task Status</label>
            <div className="select-dropdown-style">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="All Statuses">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Not Completed">Not Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-footer-actions">
          <button className="btn-clear-filters" onClick={handleReset}>
            <i className="fas fa-eraser"></i> Clear Settings
          </button>
          <div className="export-action-cluster">
            <button className="btn-export secondary-export"><i className="fas fa-file-csv"></i> Export CSV Data</button>
            <button className="btn-export primary-export"><i className="fas fa-file-pdf"></i> Download Report PDF</button>
          </div>
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
                <th style={{ width: '50px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((task) => (
                <tr key={task.id}>
                  <td className="styled-id-string">{task.shortId}</td>
                  <td className="styled-desc-paragraph">{task.desc}</td>
                  <td>
                    <div className="avatar-chip-container">
                      <img src={task.avatar} alt="" />
                      <span>{task.tech}</span>
                    </div>
                  </td>
                  <td className="styled-location-text">
                    <i className="fas fa-map-marker-alt location-marker-dot"></i> {task.location}
                  </td>
                  <td className="timestamp-data-cell">{task.completedAt}</td>
                  <td className="duration-data-cell">{task.duration}</td>
                  <td>
                    <span className={`pill-status badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                      <span className="status-bullet-dot"></span>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', position: 'relative' }}>
                    <button
                      className="btn-row-action-trigger"
                      onClick={(e) => toggleActionMenu(task.id, e)}
                    >
                      <i className="fas fa-ellipsis-h"></i>
                    </button>

                    {activeMenuId === task.id && (
                      <div className="row-action-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-menu-item"
                          onClick={() => handleOpenReport(task)}
                        >
                          <i className="fas fa-file-alt"></i> View Report
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {currentRecords.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                    {loading ? 'Loading operational history…' : 'No archived operations match the active filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
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

      {/* Operation Report Modal */}
      <OperationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={currentReportData}
        allReports={filteredTasks}
        currentIndex={selectedReportIndex}
        onPrev={() => setSelectedReportIndex(prev => Math.max(0, prev - 1))}
        onNext={() => setSelectedReportIndex(prev => Math.min(filteredTasks.length - 1, prev + 1))}
      />
    </div>
  );
}