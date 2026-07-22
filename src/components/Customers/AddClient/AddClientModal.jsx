import { useState, useRef } from 'react';
import './AddClientModal.css';
import clientGraphic from '../../../assets/clientHandshake.jpg';

export default function AddClientModal({ isOpen, onClose, onCreateClient }) {
  const [bankName, setBankName] = useState('');
  const [email, setEmail] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country] = useState('Ghana'); // Non-editable state
  const [phone, setPhone] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const newClientData = {
      name: bankName,
      email,
      phone,
      location: branchLocation,
      city,
      state,
      country,
      avatar: imagePreview || 'https://via.placeholder.com/150',
      type: 'new'
    };

    if (onCreateClient) {
      onCreateClient(newClientData);
    }

    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setBankName('');
    setEmail('');
    setBranchLocation('');
    setCity('');
    setState('');
    setPhone('');
    setImagePreview(null);
    onClose();
  };

  return (
    <div className="client-modal-blur-overlay">
      <div className="client-split-panel-modal-container">

        <div className="client-modal-left-graphic-panel" style={{ backgroundImage: `url(${clientGraphic})` }}>
          <div className="client-graphic-gradient-scrim"></div>
          <p className="client-graphic-overlay-caption">
            "Expanding our client records guarantees field technicians receive accurate enterprise details, billing routing, and verified point-of-contact site locations instantly."
          </p>
        </div>

        <div className="client-modal-right-form-panel">
          <header className="client-modal-panel-header">
            <button className="client-modal-close-icon-btn" onClick={handleResetAndClose}>&times;</button>
          </header>

          <form onSubmit={handleSubmit} className="client-modal-compact-form-layout">

            <div className="client-avatar-upload-section">
              <div className="client-avatar-preview-circle" onClick={triggerFileInput}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Client preview" className="client-uploaded-avatar-img" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="client-default-avatar-svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#ffffff"/>
                  </svg>
                )}
                <div className="client-avatar-edit-badge">
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#ffffff"/>
                  </svg>
                </div>
              </div>
              <span className="client-upload-instructions-text" onClick={triggerFileInput}>Upload corporate logo</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="client-hidden-file-input"
              />
            </div>

            <div className="client-form-input-field-block">
              <label htmlFor="bankName">Client Bank Name</label>
              <input
                id="bankName"
                type="text"
                placeholder="e.g. GCB Bank PLC"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="client-form-standard-text-input"
                required
              />
            </div>

            <div className="client-form-input-field-block">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="corporate@bank.com.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="client-form-standard-text-input"
                required
              />
            </div>

            <div className="client-form-input-field-block">
              <label htmlFor="branchLocation">Branch Address / Location</label>
              <input
                id="branchLocation"
                type="text"
                placeholder="e.g. Airport Residential Area"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
                className="client-form-standard-text-input"
                required
              />
            </div>

            {/* City & Region Grid Block */}
            <div className="client-form-row-grid-two-col">
              <div className="client-form-input-field-block">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Accra"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="client-form-standard-text-input"
                  required
                />
              </div>

              <div className="client-form-input-field-block">
                <label htmlFor="state">Region</label>
                <input
                  id="state"
                  type="text"
                  placeholder="e.g. Greater Accra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="client-form-standard-text-input"
                  required
                />
              </div>
            </div>

            <div className="client-form-row-grid-two-col">
              <div className="client-form-input-field-block">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  readOnly
                  disabled
                  className="client-form-standard-text-input client-readonly-input"
                />
              </div>

              <div className="client-form-input-field-block">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(030) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="client-form-standard-text-input"
                  required
                />
              </div>
            </div>

            <footer className="client-modal-panel-footer-row">
              <button type="button" className="client-wizard-back-navigation-btn" onClick={handleResetAndClose}>Back</button>
              <button type="submit" className="client-wizard-create-task-submit-btn">CREATE CLIENT</button>
            </footer>
          </form>
        </div>

      </div>
    </div>
  );
}