import './TechnicianProfileModal.css';

export default function TechnicianDetailsModal({
  isOpen,
  onClose,
  technician,
  allTechnicians = [],
  currentIndex = 0,
  onPrev,
  onNext,
  defaultAvatar
}) {
  if (!isOpen || !technician) return null;

  const isFirstProfile = currentIndex === 0;
  const isLastProfile = currentIndex === allTechnicians.length - 1;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Top Navigation Bar */}
        <header className="profile-modal-nav">
          <button className="nav-action-btn" onClick={onClose}>
            <i className="fas fa-arrow-left"></i> Back
          </button>

          <div className="profile-nav-group">
            <button
              className={`nav-action-btn ${isFirstProfile ? 'disabled' : ''}`}
              onClick={onPrev}
              disabled={isFirstProfile}
            >
              <i className="fas fa-chevron-left"></i> Previous Profile
            </button>
            <button
              className={`nav-action-btn ${isLastProfile ? 'disabled' : ''}`}
              onClick={onNext}
              disabled={isLastProfile}
            >
              Next Profile <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="profile-modal-content">

          {/* Left Column: Details */}
          <div className="profile-left-column">

            <section className="profile-section">
              <h3 className="section-title">Personal Details</h3>
              <div className="personal-details-grid">

                <div className="verification-photo-card">
                  <img
                    src={technician.avatar || defaultAvatar}
                    alt={technician.name}
                    className="verification-img"
                  />
                  <div className="photo-label-badge">Verification Photo</div>
                </div>

                <div className="details-fields-group">
                  <div className="field-item">
                    <span className="field-label">Name</span>
                    <p className="field-value">{technician.name || 'Marcus Chen'}</p>
                  </div>

                  <div className="field-item">
                    <span className="field-label">Gender</span>
                    <p className="field-value">{technician.gender || 'Male'}</p>
                  </div>

                  <div className="field-item">
                    <span className="field-label">Date of Birth</span>
                    <p className="field-value">{technician.dob || 'August 27th, 1999'}</p>
                  </div>

                  <div className="field-item">
                    <span className="field-label">Nationality</span>
                    <p className="field-value">{technician.nationality || 'Ghanaian'}</p>
                  </div>
                </div>

              </div>
            </section>

            <div className="profile-sub-grid">
              {/* Address Section */}
              <section className="profile-section">
                <h3 className="section-title">Address</h3>
                <div className="field-item">
                  <span className="field-label">Address Line</span>
                  <p className="field-value">{technician.address || 'No 35 Jimmy Ebi Street'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">City</span>
                  <p className="field-value">{technician.city || 'Yenagoa'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">State</span>
                  <p className="field-value">{technician.state || 'Bayelsa'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">Country</span>
                  <p className="field-value">{technician.country || 'Nigeria'}</p>
                </div>
              </section>

              {/* Contact Details & User Type */}
              <div className="contact-tier-column">
                <section className="profile-section">
                  <h3 className="section-title">Contact Details</h3>
                  <div className="field-item">
                    <span className="field-label">Phone Number</span>
                    <p className="field-value">{technician.phone}</p>
                  </div>
                  <div className="field-item">
                    <span className="field-label">Email</span>
                    <p className="field-value">{technician.email}</p>
                  </div>
                </section>

                <section className="profile-section">
                  <h3 className="section-title">Account User Type</h3>
                  <div className="tier-timeline">
                    <div className="tier-step active">
                      <span className="tier-dot"></span>
                      <span className="tier-name">Field Technician</span>
                      <span className="tier-badge-current">Current</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>

          {/* Right Column: Submitted Documents & Analytics */}
          <div className="profile-right-column">

            <section className="profile-section">
              <h3 className="section-title">Submitted Documents</h3>

              <div className="doc-card">
                <div className="doc-preview-wrapper id-card-bg">
                  <img
                    src={technician.idCardImg || "https://via.placeholder.com/400x200?text=National+ID+Card"}
                    alt="National ID Document"
                    className="doc-background-img"
                  />
                  <div className="doc-badge-overlay">
                    <span>National ID Card</span>
                    <span className="file-count-pill">1 File</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Technician Analytics (2x2 Grid) */}
            <section className="profile-section analytics-section">
              <h3 className="section-title">Technician Analytics</h3>

              <div className="analytics-2x2-grid">
                <div className="analytics-metric-card">
                  <span className="metric-label">Total Field Operations</span>
                  <h4 className="metric-value">{technician.totalOperations || 42}</h4>
                </div>

                <div className="analytics-metric-card">
                  <span className="metric-label">Completed Field Operations</span>
                  <h4 className="metric-value text-green">{technician.completedOperations || 38}</h4>
                </div>

                <div className="analytics-metric-card">
                  <span className="metric-label">Pending Operations</span>
                  <h4 className="metric-value text-amber">{technician.pendingOperations || 4}</h4>
                </div>

                <div className="analytics-metric-card">
                  <span className="metric-label">Avg. Completion Time</span>
                  <h4 className="metric-value">{technician.avgCompletionTime || '2.4 hrs'}</h4>
                </div>
              </div>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
}