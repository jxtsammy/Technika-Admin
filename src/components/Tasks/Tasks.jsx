import { useState, useMemo,  } from 'react';
import './Tasks.css';
import Profile from '../../assets/profile.png'

const INITIAL_QUEUE = [
  { id: 'T-901', title: 'Emergency Generator Repair', location: 'North Wing Data Center', priority: 'High', status: 'Dispatched', techName: 'Marcus Chen', role: 'Senior HVAC Tech', timeValue: 10, timeString: '10 mins ago', avatar: 'https://via.placeholder.com/40' },
  { id: 'T-902', title: 'Routine AC Maintenance', location: 'Building B, Floor 4', priority: 'Low', status: 'Pending', techName: 'David Rivera', role: 'Plumbing Lead', timeValue: 25, timeString: '25 mins ago', avatar: 'https://via.placeholder.com/40' },
  { id: 'T-903', title: 'Faulty Wiring Investigation', location: 'Central Lobby', priority: 'Medium', status: 'In Progress', techName: 'Sarah Jenkins', role: 'Electrical Specialist', timeValue: 60, timeString: '1 hour ago', avatar: 'https://via.placeholder.com/40' },
  { id: 'T-904', title: 'Leakage Detection', location: 'Warehousing Complex', priority: 'High', status: 'Dispatched', techName: 'David Rivera', role: 'Plumbing Lead', timeValue: 120, timeString: '2 hours ago', avatar: 'https://via.placeholder.com/40' },
  { id: 'T-905', title: 'Fiber Optic Installation', location: 'Server Room', priority: 'Medium', status: 'In Progress', techName: 'Marcus Chen', role: 'Senior HVAC Tech', timeValue: 1, timeString: '1 min ago', avatar: 'https://via.placeholder.com/40' }
];

export default function AssignTask() {
  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium - Standard');
  const [assignedTech, setAssignedTech] = useState('');

  // Dispatch Filter State
  const [dispatchFilter, setDispatchFilter] = useState('all');

  // Filter logic based on the user-requested intervals
  const filteredQueue = useMemo(() => {
    return INITIAL_QUEUE.filter(item => {
      if (dispatchFilter === 'all') return true;
      if (dispatchFilter === '1') return item.timeValue === 1;
      if (dispatchFilter === '10') return item.timeValue <= 10;
      if (dispatchFilter === '20') return item.timeValue <= 20;
      if (dispatchFilter === '30') return item.timeValue <= 30;
      if (dispatchFilter === '60') return item.timeValue === 60;
      if (dispatchFilter === 'earlier') return item.timeValue > 60;
      return true;
    });
  }, [dispatchFilter]);

  const handleAssignTask = (e) => {
    e.preventDefault();
    alert(`Task "${taskTitle}" assigned successfully!`);
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
          <span className="dispatch-label-prefix">Last dispatch: </span>
          <select
            value={dispatchFilter}
            onChange={(e) => setDispatchFilter(e.target.value)}
            className="dispatch-native-select"
          >
            <option value="all">All Activities</option>
            <option value="1">1 min ago</option>
            <option value="10">10 mins ago</option>
            <option value="20">20 mins ago</option>
            <option value="30">30 mins ago</option>
            <option value="60">1 hr ago</option>
            <option value="earlier">Earlier</option>
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
                    <option value="Marcus Chen">Marcus Chen (Senior HVAC Tech)</option>
                    <option value="David Rivera">David Rivera (Plumbing Lead)</option>
                    <option value="Sarah Jenkins">Sarah Jenkins (Electrical Specialist)</option>
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
                <button type="submit" className="btn-action-submit-dispatch"><i className="fas fa-paper-plane"></i> Assign Task</button>
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
                <div className="queue-individual-item-block" key={item.id}>
                  <div className="queue-item-meta-top-row">
                    <span className="queue-item-id-tag">{item.id}</span>
                    <span className={`status-badge-pill status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                    <span className={`priority-indicator-flag priority-${item.priority.toLowerCase()}`}>{item.priority}</span>
                  </div>

                  <h4 className="queue-item-main-title">{item.title}</h4>
                  <p className="queue-item-location-desc"><i className="fas fa-map-marker-alt"></i> {item.location}</p>

                  <div className="queue-item-technician-footer">
                    <div className="tech-assigned-profile-mini">
                      <img src={Profile} alt={item.techName} className="tech-avatar-circle" />
                      <div>
                        <p className="tech-profile-name">{item.techName}</p>
                        <p className="tech-profile-role">{item.role}</p>
                      </div>
                    </div>
                    <span className="tech-dispatch-timestamp-text"><i className="far fa-clock"></i> {item.timeString}</span>
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