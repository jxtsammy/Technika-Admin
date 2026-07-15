import { useState, useMemo, useEffect } from 'react';
import './Tasks.css';
import Profile from '../../assets/profile.png'
import api from '../../api';

// Maps the priority select label to the backend value
const PRIORITY_MAP = {
  'Low - Routine': 'low',
  'Medium - Standard': 'medium',
  'High - Urgent': 'high',
};

const technicianName = (assignedTo) =>
  assignedTo && (assignedTo.firstName || assignedTo.lastName)
    ? `${assignedTo.firstName || ''} ${assignedTo.lastName || ''}`.trim()
    : 'Unassigned';

export default function AssignTask() {
  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium - Standard');
  const [assignedTech, setAssignedTech] = useState('');

  // Data State
  const [technicians, setTechnicians] = useState([]);
  const [queue, setQueue] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Status Filter State
  const [dispatchFilter, setDispatchFilter] = useState('all');

  const loadTechnicians = async () => {
    try {
      const res = await api.get('/users/technicians');
      setTechnicians(res.data || []);
    } catch (err) {
      console.error('Failed to load technicians:', err);
    }
  };

  const loadQueue = async () => {
    try {
      const res = await api.get('/tasks');
      setQueue((res.data || []).slice(0, 10));
    } catch (err) {
      console.error('Failed to load task queue:', err);
    }
  };

  useEffect(() => {
    (async () => { await Promise.all([loadTechnicians(), loadQueue()]); })();
  }, []);

  // Filter the queue by backend status
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      if (dispatchFilter === 'all') return true;
      return item.status === dispatchFilter;
    });
  }, [queue, dispatchFilter]);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: taskTitle,
        description,
        priority: PRIORITY_MAP[priority] || 'medium',
        location: { address: location },
      };
      if (assignedTech) payload.assignedTo = assignedTech;

      await api.post('/tasks', payload);
      alert(`Task "${taskTitle}" assigned successfully!`);

      setTaskTitle('');
      setDescription('');
      setLocation('');
      setDeadline('');
      setPriority('Medium - Standard');
      setAssignedTech('');

      await loadQueue();
    } catch (err) {
      console.error('Failed to assign task:', err);
      alert('Failed to assign task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="assign-task-screen">

      {/* Top Main Heading Row */}
      <header className="assign-task-header">
        <div>
          <h2>Assign New Task</h2>
          <p className="assign-task-subtitle">Dispatch field technicians to service locations and track initial status.</p>
        </div>

        {/* Custom Interactive Dropdown for Last Dispatch Filter */}
        <div className="dispatch-filter-select-container">
          <i className="far fa-clock clock-dispatch-icon"></i>
          <span className="dispatch-label-prefix">Status: </span>
          <select
            value={dispatchFilter}
            onChange={(e) => setDispatchFilter(e.target.value)}
            className="dispatch-native-select"
          >
            <option value="all">All</option>
            <option value="available">available</option>
            <option value="pending">pending</option>
            <option value="completed">completed</option>
          </select>
          <i className="fas fa-chevron-down select-arrow-dispatch"></i>
        </div>
      </header>

      {/* Primary Dashboard Working Columns */}
      <div className="assign-task-layout-grid">

        {/* LEFT COLUMN: Input Control Form Block */}
        <div className="task-form-wrapper-column">
          <form className="task-details-card" onSubmit={handleAssignTask}>
            <div className="card-inner-header">
              <span className="form-header-icon-box"><i className="fas fa-user-plus"></i></span>
              <div>
                <h3>Task Details</h3>
                <p>Enter essential information for the field operation.</p>
              </div>
            </div>

            <div className="form-input-element-row">
              <label>Task Title</label>
              <input
                type="text"
                placeholder="e.g. Server Room HVAC Maintenance"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-input-element-row">
              <label>Detailed Description</label>
              <textarea
                placeholder="Provide specific instructions, tools required, or security access codes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-inputs-split-flex-grid">
              <div className="form-input-element-row">
                <label>Service Location</label>
                <div className="relative-input-icon-wrapper">
                  <i className="fas fa-map-marker-alt field-embedded-icon"></i>
                  <input
                    type="text"
                    placeholder="Building, Floor, Suite..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-input-element-row">
                <label>Completion Deadline</label>
                <div className="relative-input-icon-wrapper">
                  <i className="far fa-calendar field-embedded-icon"></i>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-inputs-split-flex-grid">
              <div className="form-input-element-row">
                <label>Priority Level</label>
                <div className="relative-input-icon-wrapper">
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>Low - Routine</option>
                    <option>Medium - Standard</option>
                    <option>High - Urgent</option>
                  </select>
                  <i className="fas fa-chevron-down custom-select-caret"></i>
                </div>
              </div>

              <div className="form-input-element-row">
                <label>Assign Technician</label>
                <div className="relative-input-icon-wrapper">
                  <select value={assignedTech} onChange={(e) => setAssignedTech(e.target.value)}>
                    <option value="">Search available techs...</option>
                    {technicians.map((tech) => (
                      <option key={tech._id} value={tech._id}>
                        {tech.firstName} {tech.lastName}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down custom-select-caret"></i>
                </div>
              </div>
            </div>

            <div className="task-form-submission-footer-row">
              <p className="submission-disclaimer-notice">
                <i className="far fa-dot-circle disclaimer-dot-icon"></i>
                Assigning a task will notify the technician via mobile app instantly.
              </p>
              <div className="submission-button-actions-cluster">
                <button type="button" className="btn-action-dismiss-draft">Save as Draft</button>
                <button type="submit" className="btn-action-submit-dispatch" disabled={submitting}><i className="fas fa-paper-plane"></i> {submitting ? 'Assigning...' : 'Assign Task'}</button>
              </div>
            </div>
          </form>

          {/* Bottom Green Informational Micro-Banner */}
          <footer className="smart-dispatching-tip-banner">
            <span className="tip-lightning-icon-circle"><i className="fas fa-bolt"></i></span>
            <div>
              <h4>Smart Dispatching Tip</h4>
              <p>Tasks assigned to "Available" technicians are accepted 40% faster. Check the <strong>Live Tracking</strong> screen to see who is closest to the service location before final assignment.</p>
            </div>
          </footer>
        </div>

        {/* RIGHT COLUMN: Queue Feed Activity Lists */}
        <aside className="activity-queue-wrapper-column">
          <div className="recent-queue-card-panel">
            <div className="queue-card-header-flex">
              <div>
                <h3>Recent Queue</h3>
                <p>Last 24 hours of activity</p>
              </div>
              <button className="btn-link-view-monitoring">View Monitoring</button>
            </div>

            <div className="queue-items-scroller-stack">
              {filteredQueue.map((item) => (
                <div className="queue-individual-item-block" key={item._id}>
                  <div className="queue-item-meta-top-row">
                    <span className="queue-item-id-tag">{item._id.slice(-6).toUpperCase()}</span>
                    <span className={`status-badge-pill status-${(item.status || '').toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                    <span className={`priority-indicator-flag priority-${(item.priority || '').toLowerCase()}`}>{item.priority}</span>
                  </div>

                  <h4 className="queue-item-main-title">{item.title}</h4>
                  <p className="queue-item-location-desc"><i className="fas fa-map-marker-alt"></i> {item.location?.address}</p>

                  <div className="queue-item-technician-footer">
                    <div className="tech-assigned-profile-mini">
                      <img src={Profile} alt={technicianName(item.assignedTo)} className="tech-avatar-circle" />
                      <div>
                        <p className="tech-profile-name">{technicianName(item.assignedTo)}</p>
                        <p className="tech-profile-role">Technician</p>
                      </div>
                    </div>
                    <span className="tech-dispatch-timestamp-text"><i className="far fa-clock"></i> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))}
              {filteredQueue.length === 0 && (
                <div className="queue-empty-state-fallback">No tasks match selected filter.</div>
              )}
            </div>
          </div>

          {/* Bottom Analytics Mini Grid widgets */}
          <div className="fleet-status-analytics-cards-row">
            <div className="analytics-stat-square-widget">
              <p className="analytics-widget-label">FLEET AVAILABLE</p>
              <h3 className="analytics-widget-metric">14 <span>/ 28</span></h3>
              <div className="analytics-progress-track-bar">
                <div className="analytics-progress-fill-level" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="analytics-stat-square-widget response-bg">
              <p className="analytics-widget-label color-override">AVG. RESPONSE</p>
              <h3 className="analytics-widget-metric color-override">18 min</h3>
              <p className="analytics-widget-subtext"><i className="far fa-check-circle"></i> Within KPI</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}