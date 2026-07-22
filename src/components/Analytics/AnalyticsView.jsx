import { useState } from 'react';
import './AnalyticsView.css';
import OperationReportModal from './OperationsReport/ReportModal';

const MOCK_TASKS = [
  {
    id: 'TK-4921',
    desc: 'High-Voltage Transformer Maintenance',
    tech: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
    location: 'North Substation A12',
    completedAt: '2024-05-15 14:30',
    duration: '2h 45m',
    status: 'Completed',
    companyName: 'Volta Power Grid Corp',
    clientPhone: '+233 24 123 4567',
    operationTitle: 'Transformer Oil Analysis & Terminal Check',
    priorityLevel: 'High',
    summary: 'Conducted a thorough inspection of the high-voltage transformer at North Substation A12. Tested insulation resistance, verified terminal connections, and replaced degraded oil gaskets. System is running at optimal efficiency with no further immediate anomalies detected.',
    photoEvidences: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80'
    ]
  },
  {
    id: 'TK-4883',
    desc: 'Fiber Optic Line Repair',
    tech: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    location: 'Central Hub - Floor 4',
    completedAt: '2024-05-15 11:20',
    duration: '1h 15m',
    status: 'Completed',
    companyName: 'Apex Data Communications',
    clientPhone: '+233 50 987 6543',
    operationTitle: 'Fiber Fusion Splicing',
    priorityLevel: 'Critical',
    summary: 'Spliced 12 severed fibers in main riser cable trunkline on Floor 4. Optical time-domain reflectometer (OTDR) tests confirm signal attenuation returned to normal levels below 0.2 dB loss.',
    photoEvidences: [
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80'
    ]
  },
  {
    id: 'TK-4870',
    desc: 'Industrial HVAC Filter Replacement',
    tech: 'David Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    location: 'South Manufacturing Plant',
    completedAt: '2024-05-14 16:45',
    duration: '45m',
    status: 'Not Completed',
    companyName: 'GoldCoast Logistics Ltd',
    clientPhone: '+233 20 555 0192',
    operationTitle: 'HVAC Air Handler Cleaning',
    priorityLevel: 'Medium',
    summary: 'Attempted filter replacement on Air Handler #3. Work halted because access keys to the mechanical roof penthouses were unavailable from facility security. Rescheduled for tomorrow morning.',
    photoEvidences: []
  },
  {
    id: 'TK-4852',
    desc: 'Generator Load Test',
    tech: 'Elena Rossi',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    location: 'East Emergency Backup',
    completedAt: '2024-05-14 09:15',
    duration: '3h 20m',
    status: 'Completed',
    companyName: 'Metropolitan Hospital Centre',
    clientPhone: '+233 27 444 8811',
    operationTitle: 'Annual 100% Capacity Load Bank Test',
    priorityLevel: 'High',
    summary: 'Ran 500kW diesel generator at 100% rated load for 3 continuous hours. Monitored exhaust temps, oil pressure, and frequency stability. All parameters remained well within specs.',
    photoEvidences: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'
    ]
  },
  {
    id: 'TK-4841',
    desc: 'Solar Panel Array Cleaning',
    tech: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
    location: 'Rooftop Sector 7',
    completedAt: '2024-05-13 15:50',
    duration: '2h 10m',
    status: 'Cancelled',
    companyName: 'EcoPower Solutions',
    clientPhone: '+233 24 333 2211',
    operationTitle: 'Rooftop Photovoltaic Washing',
    priorityLevel: 'Low',
    summary: 'Task cancelled due to heavy sudden downpour and lightning safety risks on the metal roof structure. Client notified.',
    photoEvidences: []
  }
];

export default function AnalyticsView() {
  const [startDate, setStartDate] = useState('2024-05-01');
  const [endDate, setEndDate] = useState('2024-05-31');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Action Menu & Modal States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);

  const recordsPerPage = 5;

  const handleReset = () => {
    setStartDate('2024-05-01');
    setEndDate('2024-05-31');
    setSelectedTech('All');
    setSelectedStatus('All Statuses');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesTech = selectedTech === 'All' || task.tech === selectedTech;
    const matchesStatus = selectedStatus === 'All Statuses' || task.status === selectedStatus;
    const matchesSearch = task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTech && matchesStatus && matchesSearch;
  });

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
            <h2>1,248</h2>
            <span className="trend-indicator trend-up"><i className="fas fa-arrow-up"></i> 12%</span>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Avg. Completion Time</span>
            <div className="icon-badge time-bg"><i className="fas fa-clock"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>2h 14m</h2>
            <span className="trend-indicator trend-up"><i className="fas fa-arrow-down"></i> 5m</span>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Exception Rate</span>
            <div className="icon-badge error-bg"><i className="fas fa-exclamation-triangle"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>3.2%</h2>
            <span className="trend-flat">Stable</span>
          </div>
        </div>

        <div className="metric-card-item">
          <div className="metric-card-header">
            <span className="metric-title">Total Distance</span>
            <div className="icon-badge distance-bg"><i className="fas fa-route"></i></div>
          </div>
          <div className="metric-value-row">
            <h2>4,850 km</h2>
            <span className="trend-indicator trend-up"><i className="fas fa-arrow-up"></i> 8.4%</span>
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
                <option value="Marcus Chen">Marcus Chen</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="David Rodriguez">David Rodriguez</option>
                <option value="Elena Rossi">Elena Rossi</option>
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
                  <td className="styled-id-string">{task.id}</td>
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