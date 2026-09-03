import { useState, useRef, useEffect } from 'react';
import './TaskModal.css';
import { tasksApi, customersApi, usersApi, fullName } from '../../../api/services';

// Leaflet Map Imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon path issues in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._defaulthide;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Dynamic camera pan and zoom when coordinates change
function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // Zoom level 16 zooms in close to the street/site level
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function AddTaskModal({ isOpen, onClose, onCreateTask }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [technician, setTechnician] = useState('');
  const [technicianId, setTechnicianId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [showCompanyTips, setShowCompanyTips] = useState(false);
  const [showLocationTips, setShowLocationTips] = useState(false);
  const [showTechTips, setShowTechTips] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Map state (Default coordinates for Accra)
  const [mapPosition, setMapPosition] = useState([5.6037, -0.1870]);

  const companyRef = useRef(null);
  const locationRef = useRef(null);
  const techRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    customersApi.list().then(setCustomers).catch(() => setCustomers([]));
    usersApi.getTechnicians().then(setTechnicians).catch(() => setTechnicians([]));
  }, [isOpen]);

  // Geocode location search text into coordinates using Nominatim API
  useEffect(() => {
    if (!locationSearch.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setMapPosition([lat, lon]);
          }
        })
        .catch((err) => console.error("Web geocoding failed:", err));
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [locationSearch]);

  const customerNames = customers.map((c) => c.name);
  const locationNames = [...new Set(customers.map((c) => c.location).filter(Boolean))];

  const filteredCompanies = customerNames.filter((c) =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredLocations = locationNames.filter((l) =>
    l.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const suggestedTechnicians = technicians
    .map((t) => ({ id: t._id, name: fullName(t), isOnline: t.isOnline }))
    .filter((t) => t.name.toLowerCase().includes(technician.toLowerCase()));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError('');

    let assignedTo = technicianId;
    if (!assignedTo && technician.trim()) {
      const match = suggestedTechnicians.find(
        (t) => t.name.toLowerCase() === technician.trim().toLowerCase()
      );
      assignedTo = match?.id || null;
    }

    try {
      const created = await tasksApi.create({
        title: taskName,
        description,
        assignedTo: assignedTo || undefined,
        location: locationSearch
          ? {
              address: locationSearch,
              coordinates: [mapPosition[1], mapPosition[0]],
            }
          : undefined,
        priority: priority.toLowerCase(),
        companyName: companySearch,
        callerPhone,
      });

      if (onCreateTask) onCreateTask(created);

      setTaskName(''); setDescription(''); setCompanySearch('');
      setLocationSearch(''); setCallerPhone(''); setPriority('Medium');
      setTechnician(''); setTechnicianId(null);

      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-blur-overlay">
      <div className="split-panel-modal-container">

        {/* LEFT PANEL: Edge-to-Edge Map Zoomed In */}
        <div className="modal-left-graphic-panel">
          <MapContainer
            center={mapPosition}
            zoom={16}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapPosition}>
              <Popup>
                {locationSearch || "Selected Location"}
              </Popup>
            </Marker>
            <MapRecenter position={mapPosition} />
          </MapContainer>
        </div>

        {/* RIGHT PANEL: Form */}
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
                  placeholder="Assign a field technician..."
                  value={technician}
                  onChange={(e) => { setTechnician(e.target.value); setTechnicianId(null); setShowTechTips(true); }}
                  onFocus={() => setShowTechTips(true)}
                  className="form-standard-text-input"
                />
                {showTechTips && (
                  <ul className="autocomplete-suggestions-dropdown-list">
                    {suggestedTechnicians.length > 0 ? (
                      suggestedTechnicians.map((t) => (
                        <li key={t.id} onClick={() => { setTechnician(t.name); setTechnicianId(t.id); setShowTechTips(false); }}>
                          {t.name} <span className="tech-region-tag">({t.isOnline ? 'Online' : 'Offline'})</span>
                        </li>
                      ))
                    ) : (
                      <li className="no-suggestions-indicator-item">No matching technicians found</li>
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
              {submitError && (
                <span style={{ color: '#b3261e', fontSize: '0.85rem', marginRight: 'auto' }}>
                  {submitError}
                </span>
              )}
              <button type="button" className="wizard-back-navigation-btn" onClick={onClose} disabled={submitting}>Back</button>
              <button type="submit" className="wizard-create-task-submit-btn" disabled={submitting}>
                {submitting ? 'CREATING…' : 'CREATE OPERATION'}
              </button>
            </footer>

          </form>
        </div>

      </div>
    </div>
  );
}