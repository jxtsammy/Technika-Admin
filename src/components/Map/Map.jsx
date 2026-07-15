import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { techniciansData } from './TechnicianData';
import './Map.css';

// Fix for default Leaflet marker icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom component to handle smooth flyTo panning navigation animations
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, online, offline
  const [sortBy, setSortBy] = useState('nearest'); // nearest, farthest
  const [maxDistance, setMaxDistance] = useState(3000); // Filter parameter by meters
  const [selectedTech, setSelectedTech] = useState(techniciansData[0]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";

  const handleTechClick = (tech) => {
    setSelectedTech(tech);
    setMapCenter([tech.lat, tech.lng]);
  };

  // Filter and Sort Processing Pipeline
  const filteredTechnicians = techniciansData
    .filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;
      const matchesDistance = tech.distance <= maxDistance;
      return matchesSearch && matchesStatus && matchesDistance;
    })
    .sort((a, b) => {
      return sortBy === 'nearest' ? a.distance - b.distance : b.distance - a.distance;
    });

  return (
    <div className="map-screen-layout">

      {/* Left Sidebar Paneling Controls */}
      <div className="map-sidebar">

        {/* Search Field Bar */}
        <div className="search-box-wrapper">
          <i className="fa-solid fa-magnifying-glass search-inline-icon"></i>
          <input
            type="text"
            placeholder="Search technician by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search-field"
          />
        </div>

        {/* Filter Dropdown Select Rows */}
        <div className="filter-controls-row">
          <div className="filter-item">
            <label>Show me:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="nearest">Nearest</option>
              <option value="farthest">Farthest</option>
            </select>
          </div>
        </div>

        {/* Dynamic Range Distance Filter Button Action Row */}
        <div className="advanced-filter-bar">
          <i className="fa-solid fa-sliders slider-icon"></i>
          <span className="filter-label">Max Distance: <strong>{maxDistance}m</strong></span>
          <input
            type="range"
            min="500"
            max="4000"
            step="500"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="distance-range-slider"
          />
        </div>

        {/* Scrollable Technicians Dynamic List View */}
        <div className="technicians-list-container">
          {filteredTechnicians.length > 0 ? (
            filteredTechnicians.map((tech) => (
              <div
                key={tech.id}
                className={`tech-list-card ${selectedTech?.id === tech.id ? 'active' : ''}`}
                onClick={() => handleTechClick(tech)}
              >
                <div className="tech-card-left">
                  <img src={defaultAvatar} alt={tech.name} className="tech-avatar-img" />
                  <div className="tech-meta-details">
                    <h4>{tech.name}</h4>
                    <p className="tech-distance-text">
                      <i className="fa-solid fa-location-dot"></i> {(tech.distance / 1000).toFixed(1)} km away
                    </p>
                  </div>
                </div>
                <div className="tech-card-right">
                  <span className={`status-badge-dot ${tech.status}`}></span>
                  <i className="fa-solid fa-chevron-right arrow-indicator"></i>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-search-fallback">
              <i className="fa-regular fa-user-xmark"></i>
              <p>No technicians match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Interactive Map Area Grid */}
      <div className="map-viewport-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={13}
          zoomControl={false}
          className="leaflet-master-map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Inject recentering helper hook logic */}
          <MapRecenter center={mapCenter} />

          {/* Render markers for filtered techs */}
          {filteredTechnicians.map((tech) => (
            <Marker
              key={tech.id}
              position={[tech.lat, tech.lng]}
              eventHandlers={{ click: () => handleTechClick(tech) }}
            >
              <Popup>
                <strong style={{ fontSize: '14px' }}>{tech.name}</strong><br />
                <span style={{ color: '#6b7280', fontSize: '12px' }}>{tech.specialty}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}