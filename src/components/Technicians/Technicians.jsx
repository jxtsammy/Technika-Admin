import { useState, useMemo, useRef, useEffect } from 'react';
import './Technicians.css';
import Profile from '../../assets/profile.png'
import api from '../../api';

const fullName = (tech) =>
  `${tech.firstName || ''} ${tech.lastName || ''}`.trim();

export default function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const ITEMS_PER_PAGE = 5;
  const menuRef = useRef(null);

  useEffect(() => {
    async function loadTechnicians() {
      try {
        const res = await api.get('/users/technicians');
        setTechnicians(res.data || []);
      } catch (err) {
        console.error('Failed to load technicians:', err);
      }
    }
    loadTechnicians();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCriteria]);

  const filteredTechnicians = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return technicians.filter(tech => {
      const name = fullName(tech).toLowerCase();
      const email = (tech.email || '').toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);

      if (!matchesSearch) return false;
      if (filterCriteria === 'all') return true;
      if (filterCriteria === 'name') return name.includes(query);
      if (filterCriteria === 'email') return email.includes(query);
      if (filterCriteria === 'Online') return tech.isOnline === true;
      if (filterCriteria === 'Offline') return tech.isOnline === false;

      return true;
    });
  }, [technicians, searchQuery, filterCriteria]);

  const totalItems = filteredTechnicians.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const paginatedTechnicians = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTechnicians.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTechnicians, currentPage]);

  const onlineCount = useMemo(() => technicians.filter(t => t.isOnline === true).length, [technicians]);
  const offlineCount = useMemo(() => technicians.filter(t => t.isOnline === false).length, [technicians]);

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this technician?')) return;
    try {
      await api.delete(`/users/${id}`);
      setTechnicians(prev => prev.filter(tech => tech._id !== id));
    } catch (err) {
      console.error('Failed to deactivate technician:', err);
    }
    setActiveMenuId(null);
  };

  return (
    <div className="technicians-screen">
      <header className="technicians-screen-header">
        <div>
          <h2>Technicians</h2>
          <p className="technicians-subtitle">Manage your field workforce and operational status.</p>
        </div>
        <button className="technicians-btn-add-tech">
          <i className="fas fa-plus"></i> Add New Technician
        </button>
      </header>

      <section className="technicians-summary-grid">
        <div className="technicians-summary-card">
          <div>
            <p className="technicians-summary-label">Total Personnel</p>
            <h3 className="technicians-summary-value">{technicians.length}</h3>
          </div>
          <span className="technicians-summary-icon-circle technicians-blue-circle"><i className="fas fa-users"></i></span>
        </div>
        <div className="technicians-summary-card">
          <div>
            <p className="technicians-summary-label">Online Technicians</p>
            <h3 className="technicians-summary-value">{onlineCount}</h3>
          </div>
          <span className="technicians-summary-icon-circle technicians-green-circle"><i className="far fa-check-circle"></i></span>
        </div>
        <div className="technicians-summary-card">
          <div>
            <p className="technicians-summary-label">Offline Technicians</p>
            <h3 className="technicians-summary-value">{offlineCount}</h3>
          </div>
          <span className="technicians-summary-icon-circle technicians-green-circle"><i className="far fa-x-circle"></i></span>
        </div>
      </section>

      <main className="technicians-table-container-card">
        <div className="technicians-table-controls-header">
          <h3>Personnel Directory</h3>
          <div className="technicians-controls-group">
            <div className="technicians-search-bar-wrapper">
              <i className="fas fa-search technicians-search-icon"></i>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="technicians-filter-select-wrapper">
              <i className="fas fa-filter technicians-filter-icon"></i>
              <select
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              >
                <option value="all">Filter: All Criteria</option>
                <option value="name">Criteria: Name Only</option>
                <option value="email">Criteria: Email Only</option>
                <option value="Online">Status: Online</option>
                <option value="Offline">Status: Offline</option>
              </select>
              <i className="fas fa-chevron-down technicians-select-arrow"></i>
            </div>
          </div>
        </div>

        <div className="technicians-responsive-table-wrapper">
          <table className="technicians-directory-table">
            <thead>
              <tr>
                <th>TECHNICIAN</th>
                <th>CONTACT DETAILS</th>
                <th>STATUS</th>
                <th>LOCATION</th>
                <th className="technicians-text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTechnicians.map((tech) => (
                <tr key={tech._id}>
                  <td>
                    <div className="technicians-tech-profile-cell">
                      <div className="technicians-profile-image-circle">
                        <img
                          src={tech.profilePicture || Profile}
                          alt={fullName(tech)}
                          className="technicians-avatar-img"
                        />
                      </div>
                      <div>
                        <p className="technicians-tech-name">{fullName(tech)}</p>
                        <p className="technicians-tech-id">ID: {tech._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="technicians-contact-details-cell">
                      <p><i className="far fa-envelope"></i> {tech.email}</p>
                      <p><i className="fas fa-phone-alt"></i> {tech.phoneNumber}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`technicians-status-tag-badge technicians-status-${tech.isOnline ? 'active' : 'inactive'}`}>
                      {tech.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td>
                    <div className="technicians-assignment-cell">
                      <p className="technicians-assignment-title">
                        {tech.location?.latitude != null && tech.location?.longitude != null
                          ? `${tech.location.latitude}, ${tech.location.longitude}`
                          : 'No location'}
                      </p>
                    </div>
                  </td>
                  <td className="technicians-text-right technicians-position-relative">
                    <button
                      className="technicians-btn-actions-trigger"
                      onClick={() => setActiveMenuId(activeMenuId === tech._id ? null : tech._id)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>

                    {activeMenuId === tech._id && (
                      <div className="technicians-actions-fade-menu" ref={menuRef}>
                        <button className="technicians-menu-action-item" onClick={() => setActiveMenuId(null)}>
                          <i className="far fa-eye"></i> View Details
                        </button>
                        <button className="technicians-menu-action-item technicians-remove" onClick={() => handleRemove(tech._id)}>
                          <i className="far fa-trash-alt"></i> Deactivate
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedTechnicians.length === 0 && (
                <tr>
                  <td colSpan="5" className="technicians-empty-state-cell">No matching technicians located.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="technicians-table-pagination-footer">
          <span className="technicians-showing-entries-text">
            Showing <strong>{paginatedTechnicians.length}</strong> of <strong>{totalItems}</strong> technicians
          </span>
          <div className="technicians-pagination-nav-controls">
            <button
              className="technicians-nav-arrow-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={`technicians-page-num-btn ${currentPage === pageNumber ? 'technicians-active' : ''}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="technicians-nav-arrow-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </footer>
      </main>

      <footer className="technicians-policy-reminder-alert">
        <div className="technicians-reminder-icon-wrapper">
          <i className="far fa-clock"></i>
        </div>
        <div>
          <h4>Operational Policy Reminder</h4>
          <p>Technicians marked as "Inactive" for more than 14 days without an approved leave request should be reviewed for deactivation. Ensure all contact information is kept up-to-date for emergency dispatch protocols.</p>
        </div>
      </footer>
    </div>
  );
}