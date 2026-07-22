import { useState, useMemo, useRef, useEffect } from 'react';
import './Technicians.css';
import Profile from '../../assets/profile.png';
import TechnicianDetailsModal from './TechnicianDetails/TechnicianProfileModal';

const INITIAL_TECHNICIANS = [
  {
    id: 'TECH-001',
    name: 'Tomiwa Oyeledu Dolapo',
    email: 'tomilola@me.com',
    phone: '09034867656',
    status: 'Active',
    assignment: 'Main Power Grid Repair',
    assignmentStatus: 'In Progress',
    avatar: Profile,
    gender: 'Female',
    dob: 'August 27th, 1999',
    nationality: 'Nigerian',
    address: 'No 35 Jimmy Ebi Street',
    city: 'Yenagoa',
    state: 'Bayelsa',
    country: 'Nigeria',
    totalOperations: 42,
    completedOperations: 38,
    pendingOperations: 4,
    avgCompletionTime: '2.4 hrs'
  },
  {
    id: 'TECH-002',
    name: 'Sarah Jenkins',
    email: 's.jenkins@teknica.com',
    phone: '+1 (555) 987-6543',
    status: 'Active',
    assignment: 'Routine Substation Inspection',
    assignmentStatus: 'Pending',
    avatar: 'https://via.placeholder.com/150',
    gender: 'Female',
    dob: 'May 14th, 1995',
    nationality: 'Ghanaian',
    address: '12 Independence Ave',
    city: 'Accra',
    state: 'Greater Accra',
    country: 'Ghana',
    totalOperations: 29,
    completedOperations: 25,
    pendingOperations: 4,
    avgCompletionTime: '3.1 hrs'
  },
  {
    id: 'TECH-003',
    name: 'Robert Miller',
    email: 'r.miller@teknica.com',
    phone: '+1 (555) 456-7890',
    status: 'Inactive',
    assignment: 'No Active Task',
    assignmentStatus: '',
    avatar: 'https://via.placeholder.com/150',
    gender: 'Male',
    dob: 'November 03, 1991',
    nationality: 'Nigerian',
    address: '88 Ring Road',
    city: 'Ibadan',
    state: 'Oyo',
    country: 'Nigeria',
    totalOperations: 15,
    completedOperations: 12,
    pendingOperations: 3,
    avgCompletionTime: '4.0 hrs'
  },
  {
    id: 'TECH-004',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@teknica.com',
    phone: '+1 (555) 222-3333',
    status: 'Active',
    assignment: 'Fiber Optic Installation',
    assignmentStatus: 'In Progress',
    avatar: 'https://via.placeholder.com/150',
    gender: 'Female',
    dob: 'March 19, 1997',
    nationality: 'Ghanaian',
    address: '45 Lake View St',
    city: 'Kumasi',
    state: 'Ashanti',
    country: 'Ghana',
    totalOperations: 56,
    completedOperations: 52,
    pendingOperations: 4,
    avgCompletionTime: '1.8 hrs'
  },
  {
    id: 'TECH-005',
    name: 'David Wilson',
    email: 'd.wilson@teknica.com',
    phone: '+1 (555) 777-8888',
    status: 'Active',
    assignment: 'Hydraulic Valve Replacement',
    assignmentStatus: 'Pending',
    avatar: 'https://via.placeholder.com/150',
    gender: 'Male',
    dob: 'January 10, 1993',
    nationality: 'Nigerian',
    address: '14 Marina Road',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    totalOperations: 33,
    completedOperations: 30,
    pendingOperations: 3,
    avgCompletionTime: '2.9 hrs'
  }
];

export default function Technicians() {
  const [technicians, setTechnicians] = useState(INITIAL_TECHNICIANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal & Index Tracking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechIndex, setSelectedTechIndex] = useState(0);

  const ITEMS_PER_PAGE = 5;
  const menuRef = useRef(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, filterCriteria]);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter(tech => {
      const matchesSearch =
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterCriteria === 'all') return true;
      if (filterCriteria === 'name') return tech.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterCriteria === 'email') return tech.email.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterCriteria === 'Active' || filterCriteria === 'Inactive') return tech.status === filterCriteria;

      return true;
    });
  }, [technicians, searchQuery, filterCriteria]);

  const totalItems = filteredTechnicians.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const paginatedTechnicians = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTechnicians.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTechnicians, currentPage]);

  const activeCount = useMemo(() => technicians.filter(t => t.status === 'Active').length, [technicians]);
  const inActiveCount = useMemo(() => technicians.filter(t => t.status === 'Inactive').length, [technicians]);
  const onTaskCount = useMemo(() => technicians.filter(t => t.assignmentStatus !== '').length, [technicians]);

  const handleRemove = (id) => {
    setTechnicians(prev => prev.filter(tech => tech.id !== id));
    setActiveMenuId(null);
  };

  // Open modal and compute selected index relative to filtered list
  const handleOpenDetailsModal = (tech) => {
    const index = filteredTechnicians.findIndex(t => t.id === tech.id);
    setSelectedTechIndex(index !== -1 ? index : 0);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // Modal navigation callbacks
  const handlePrevProfile = () => {
    if (selectedTechIndex > 0) {
      setSelectedTechIndex(prev => prev - 1);
    }
  };

  const handleNextProfile = () => {
    if (selectedTechIndex < filteredTechnicians.length - 1) {
      setSelectedTechIndex(prev => prev + 1);
    }
  };

  return (
    <div className="technicians-screen">
      <header className="technicians-screen-header">
        <div>
          <h2>Technicians</h2>
          <p className="technicians-subtitle">Manage your field workforce and operational status.</p>
        </div>
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
            <p className="technicians-summary-label">Active Technicians</p>
            <h3 className="technicians-summary-value">{activeCount}</h3>
          </div>
          <span className="technicians-summary-icon-circle technicians-green-circle"><i className="far fa-check-circle"></i></span>
        </div>
        <div className="technicians-summary-card">
          <div>
            <p className="technicians-summary-label">Inactive Technicians</p>
            <h3 className="technicians-summary-value">{inActiveCount}</h3>
          </div>
          <span className="technicians-summary-icon-circle technicians-green-circle"><i className="far fa-x-circle"></i></span>
        </div>
        <div className="technicians-summary-card">
          <div>
            <p className="technicians-summary-label">On Active Task</p>
            <h3 className="technicians-summary-value">{onTaskCount}</h3>
          </div>
          <span className="technicians-summary-icon-circle technicians-gray-circle"><i className="far fa-clock"></i></span>
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
                <option value="Active">Status: Active</option>
                <option value="Inactive">Status: Inactive</option>
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
                <th>CURRENT ASSIGNMENT</th>
                <th className="technicians-text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTechnicians.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    <div className="technicians-tech-profile-cell">
                      <div className="technicians-profile-image-circle">
                        <img
                          src={tech.avatar || Profile}
                          alt={tech.name}
                          className="technicians-avatar-img"
                        />
                      </div>
                      <div>
                        <p className="technicians-tech-name">{tech.name}</p>
                        <p className="technicians-tech-id">ID: {tech.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="technicians-contact-details-cell">
                      <p><i className="far fa-envelope"></i> {tech.email}</p>
                      <p><i className="fas fa-phone-alt"></i> {tech.phone}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`technicians-status-tag-badge technicians-status-${tech.status.toLowerCase()}`}>
                      {tech.status}
                    </span>
                  </td>
                  <td>
                    <div className="technicians-assignment-cell">
                      <p className="technicians-assignment-title">
                        {tech.assignment}{' '}
                        {tech.assignmentStatus && <i className="fas fa-external-link-alt technicians-external-link"></i>}
                      </p>
                      {tech.assignmentStatus && (
                        <p className="technicians-assignment-status-desc">
                          <span className={`technicians-indicator-dot technicians-indicator-${tech.assignmentStatus.toLowerCase().replace(' ', '-')}`}></span>
                          {tech.assignmentStatus}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="technicians-text-right technicians-position-relative">
                    <button
                      className="technicians-btn-actions-trigger"
                      onClick={() => setActiveMenuId(activeMenuId === tech.id ? null : tech.id)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>

                    {activeMenuId === tech.id && (
                      <div className="technicians-actions-fade-menu" ref={menuRef}>
                        <button className="technicians-menu-action-item" onClick={() => handleOpenDetailsModal(tech)}>
                          <i className="far fa-eye"></i> View Details
                        </button>
                        <button className="technicians-menu-action-item technicians-remove" onClick={() => handleRemove(tech.id)}>
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

      {/* External Details Modal with Profile Navigation */}
      <TechnicianDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technician={filteredTechnicians[selectedTechIndex]}
        allTechnicians={filteredTechnicians}
        currentIndex={selectedTechIndex}
        onPrev={handlePrevProfile}
        onNext={handleNextProfile}
        defaultAvatar={Profile}
      />
    </div>
  );
}