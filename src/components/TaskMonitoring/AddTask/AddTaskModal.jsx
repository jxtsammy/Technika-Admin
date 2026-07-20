import { useState, useRef, useEffect } from 'react';
import './TaskModal.css';
import taskGraphic from '../../../assets/taskImg.jpg';

export default function AddTaskModal({ isOpen, onClose, onCreateTask }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [technician, setTechnician] = useState('');

  const [showCompanyTips, setShowCompanyTips] = useState(false);
  const [showLocationTips, setShowLocationTips] = useState(false);
  const [showTechTips, setShowTechTips] = useState(false);

  const companyRef = useRef(null);
  const locationRef = useRef(null);
  const techRef = useRef(null);

  const customerDatabase = [
    'GCB Bank PLC', 'Ecobank Ghana', 'Absa Bank Ghana',
    'Stanbic Bank Ghana', 'Fidelity Bank Ghana',
    'Standard Chartered', 'Zenith Bank Ghana',
    'CalBank PLC', 'Consolidated Bank Ghana'
  ];

  const locationDatabase = [
    'Airport Residential Area, Accra', 'Osu, Accra', 'East Legon, Accra',
    'Ridge, Accra', 'Adabraka, Accra', 'Danes Bar, Kumasi', 'Kwadaso, Kumasi'
  ];

  const technicianDatabase = [
    { name: 'Kwame Mensah', region: 'Accra' },
    { name: 'Emmanuel Osei', region: 'Accra' },
    { name: 'John Mahama', region: 'Accra' },
    { name: 'Kofi Asante', region: 'Kumasi' },
    { name: 'Baba Moro', region: 'Kumasi' }
  ];

  const filteredCompanies = customerDatabase.filter(c =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredLocations = locationDatabase.filter(l =>
    l.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const suggestedTechnicians = technicianDatabase.filter(tech => {
    if (!locationSearch) return true;
    return locationSearch.toLowerCase().includes(tech.region.toLowerCase());
  }).filter(t => t.name.toLowerCase().includes(technician.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event) {
      if (companyRef.current && !companyRef.current.contains(event.target)) setShowCompanyTips(false);
      if (locationRef.current && !locationRef.current.contains(event.target)) setShowLocationTips(false);
      if (techRef.current && !techRef.current.contains(event.target)) setShowTechTips(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const taskPayload = {
      taskName,
      description,
      companyName: companySearch,
      location: locationSearch,
      callerPhone,
      priority,
      technician
    };

    alert(`Success: Field operation "${taskName}" has been successfully created and dispatched!`);

    if (onCreateTask) onCreateTask(taskPayload);
    onClose();
  };

  return (
    <div className="modal-blur-overlay">
      <div className="split-panel-modal-container">

        <div className="modal-left-graphic-panel" style={{ backgroundImage: `url(${taskGraphic})` }}>
          <div className="graphic-gradient-scrim"></div>
          <p className="graphic-overlay-caption">
            "Synchronizing the task dispatch queue ensures field technicians receive updated job tickets and navigation alerts safely without miscommunication points."
          </p>
        </div>

        <div className="modal-right-form-panel">
          <header className="modal-panel-header">
            <h2>Create Field Operation</h2>
            <button className="modal-close-icon-btn" onClick={onClose}>&times;</button>
          </header>

          <form onSubmit={handleSubmit} className="modal-compact-form-layout">

            <div className="form-input-field-block">
              <label htmlFor="taskName">Operation Name</label>
              <input
                id="taskName"
                type="text"
                placeholder="Enter task identifier..."
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="form-standard-text-input"
                required
              />
            </div>

            <div className="form-input-field-block">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter operation description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-standard-textarea-field modular-height"
              />
            </div>

            <div className="form-two-column-grid-row">
              <div className="form-input-field-block custom-relative" ref={companyRef}>
                <label htmlFor="companyName">Name of Company</label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Type company..."
                  value={companySearch}
                  onChange={(e) => { setCompanySearch(e.target.value); setShowCompanyTips(true); }}
                  onFocus={() => setShowCompanyTips(true)}
                  className="form-standard-text-input"
                />
                {showCompanyTips && companySearch.trim() && filteredCompanies.length > 0 && (
                  <ul className="autocomplete-suggestions-dropdown-list">
                    {filteredCompanies.map((c, i) => (
                      <li key={i} onClick={() => { setCompanySearch(c); setShowCompanyTips(false); }}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-input-field-block custom-relative" ref={locationRef}>
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Type site location..."
                  value={locationSearch}
                  onChange={(e) => { setLocationSearch(e.target.value); setShowLocationTips(true); }}
                  onFocus={() => setShowLocationTips(true)}
                  className="form-standard-text-input"
                />
                {showLocationTips && locationSearch.trim() && filteredLocations.length > 0 && (
                  <ul className="autocomplete-suggestions-dropdown-list">
                    {filteredLocations.map((l, i) => (
                      <li key={i} onClick={() => { setLocationSearch(l); setShowLocationTips(false); }}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-two-column-grid-row">
              <div className="form-input-field-block">
                <label htmlFor="priority">Priority</label>
                <div className="custom-select-input-wrapper">
                  <span className={`priority-indicator-dot ${priority.toLowerCase()}`}></span>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="form-inline-select-dropdown padding-left-dot"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-input-field-block custom-relative" ref={techRef}>
                <label htmlFor="technician">Technician Assignee</label>
                <input
                  id="technician"
                  type="text"
                  placeholder={locationSearch ? "Showing nearby field agents..." : "Assign a field technician..."}
                  value={technician}
                  onChange={(e) => { setTechnician(e.target.value); setShowTechTips(true); }}
                  onFocus={() => setShowTechTips(true)}
                  className="form-standard-text-input"
                />
                {showTechTips && (
                  <ul className="autocomplete-suggestions-dropdown-list">
                    {suggestedTechnicians.length > 0 ? (
                      suggestedTechnicians.map((t, i) => (
                        <li key={i} onClick={() => { setTechnician(t.name); setShowTechTips(false); }}>
                          {t.name} <span className="tech-region-tag">({t.region})</span>
                        </li>
                      ))
                    ) : (
                      <li className="no-suggestions-indicator-item">No matching regional agents found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-input-field-block alignment-half-width">
              <label htmlFor="callerPhone">Phone number (Service Caller)</label>
              <input
                id="callerPhone"
                type="tel"
                placeholder="(030) 000-0000"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className="form-standard-text-input"
              />
            </div>

            <footer className="modal-panel-footer-row">
              <button type="button" className="wizard-back-navigation-btn" onClick={onClose}>Back</button>
              <button type="submit" className="wizard-create-task-submit-btn">CREATE OPERATION</button>
            </footer>

          </form>
        </div>

      </div>
    </div>
  );
}