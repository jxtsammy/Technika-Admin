import './ClientProfile.css';

export default function ClientDetailsModal({
  isOpen,
  onClose,
  client,
  allClients = [],
  currentIndex = 0,
  onPrev,
  onNext,
  defaultLogo
}) {
  if (!isOpen || !client) return null;

  const isFirstProfile = currentIndex === 0;
  const isLastProfile = currentIndex === allClients.length - 1;

  return (
    <div className="client-modal-overlay" onClick={onClose}>
      <div className="client-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Top Navigation Bar */}
        <header className="client-modal-nav">
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
        <div className="client-modal-content">

          {/* Left Column: Client Profile & Details */}
          <div className="client-left-column">

            <section className="client-section">
              <h3 className="section-title">Client Details</h3>
              <div className="client-details-grid">

                <div className="verification-photo-card">
                  <img
                    src={client.avatar || defaultLogo || "https://via.placeholder.com/200?text=Client+Logo"}
                    alt={client.name}
                    className="verification-img"
                  />
                  <div className="photo-label-badge">Client Profile</div>
                </div>

                <div className="details-fields-group">
                  <div className="field-item">
                    <span className="field-label">Name</span>
                    <p className="field-value">{client.name || 'GCB Bank PLC'}</p>
                  </div>

                  <div className="field-item">
                    <span className="field-label">Client Type</span>
                    <p className="field-value">{client.clientType || 'Bank'}</p>
                  </div>

                  <div className="field-item">
                    <span className="field-label">Date of Onboarding</span>
                    <p className="field-value">{client.onboardingDate || 'August 27th, 2023'}</p>
                  </div>
                </div>

              </div>
            </section>

            <div className="client-sub-grid">
              {/* Location Section */}
              <section className="client-section">
                <h3 className="section-title">Location</h3>
                <div className="field-item">
                  <span className="field-label">Client Location</span>
                  <p className="field-value">{client.location || 'High Street, Accra Central'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">City</span>
                  <p className="field-value">{client.city || 'Accra'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">State / Region</span>
                  <p className="field-value">{client.state || 'Greater Accra'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">Country</span>
                  <p className="field-value">{client.country || 'Ghana'}</p>
                </div>
              </section>

              {/* Contact Details */}
              <section className="client-section">
                <h3 className="section-title">Contact Details</h3>
                <div className="field-item">
                  <span className="field-label">Phone Number</span>
                  <p className="field-value">{client.phone || '+233 30 268 6100'}</p>
                </div>
                <div className="field-item">
                  <span className="field-label">Email</span>
                  <p className="field-value">{client.email || 'corporate@gcbbank.com.gh'}</p>
                </div>
              </section>
            </div>

          </div>

          {/* Right Column: Client Service Analytics */}
          <div className="client-right-column">

            <section className="client-section analytics-section">
              <h3 className="section-title">Client Service Analytics</h3>

              <div className="analytics-2x2-grid">
                <div className="analytics-metric-card">
                  <span className="metric-label">Total Projects Handled</span>
                  <h4 className="metric-value">{client.totalProjects || 28}</h4>
                </div>

                <div className="analytics-metric-card">
                  <span className="metric-label">Completed Services</span>
                  <h4 className="metric-value text-green">{client.completedServices || 25}</h4>
                </div>

                <div className="analytics-metric-card">
                  <span className="metric-label">Ongoing Requests</span>
                  <h4 className="metric-value text-amber">{client.ongoingRequests || 3}</h4>
                </div>

                <div className="analytics-metric-card">
                  <span className="metric-label">Pending Requests</span>
                  <h4 className="metric-value text-amber">{client.pendingRequests ?? 0}</h4>
                </div>
              </div>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
}