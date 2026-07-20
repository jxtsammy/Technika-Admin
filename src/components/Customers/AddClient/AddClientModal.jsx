import { useState } from 'react';
import './AddClientModal.css';
import clientGraphic from '../../../assets/clientHandshake.jpg';

export default function AddClientModal({ isOpen, onClose, onCreateClient }) {
  const [bankName, setBankName] = useState('');
  const [email, setEmail] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bankName.trim()) return;

    const clientPayload = { bankName, email, branchLocation, phone };

    if (onCreateClient) {
      onCreateClient(clientPayload);
    }

    alert(`Success: ${bankName} has been successfully registered!`);

    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setBankName('');
    setEmail('');
    setBranchLocation('');
    setPhone('');
    onClose();
  };

  return (
    <div className="modal-blur-overlay">
      <div className="split-panel-modal-container">

        <div className="modal-left-graphic-panel" style={{ backgroundImage: `url(${clientGraphic})` }}>
          <div className="graphic-gradient-scrim"></div>
          <p className="graphic-overlay-caption">
            "Expanding our client records guarantees field technicians receive accurate enterprise details, billing routing, and verified point-of-contact site locations instantly."
          </p>
        </div>

        <div className="modal-right-form-panel">
          <header className="modal-panel-header">
            <h2>Create New Client</h2>
            <button className="modal-close-icon-btn" onClick={handleResetAndClose}>&times;</button>
          </header>

          <form onSubmit={handleSubmit} className="modal-compact-form-layout">
            <div className="form-input-field-block">
              <label htmlFor="bankName">Client Bank Name</label>
              <input
                id="bankName"
                type="text"
                placeholder="e.g. GCB Bank PLC"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="form-standard-text-input"
                required
              />
            </div>

            <div className="form-input-field-block">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="corporate@bank.com.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-standard-text-input"
                required
              />
            </div>

            <div className="form-input-field-block">
              <label htmlFor="branchLocation">Branch Location</label>
              <input
                id="branchLocation"
                type="text"
                placeholder="e.g. Airport Residential Area, Accra"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
                className="form-standard-text-input"
                required
              />
            </div>

            <div className="form-input-field-block alignment-half-width">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="(030) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-standard-text-input"
                required
              />
            </div>

            <footer className="modal-panel-footer-row">
              <button type="button" className="wizard-back-navigation-btn" onClick={handleResetAndClose}>Back</button>

              <div className="wizard-dot-pagination-track">
                <span className="pagination-dot active-step-dot"></span>
                <span className="pagination-dot"></span>
              </div>

              <button type="submit" className="wizard-create-task-submit-btn">ADD CLIENT</button>
            </footer>
          </form>
        </div>

      </div>
    </div>
  );
}