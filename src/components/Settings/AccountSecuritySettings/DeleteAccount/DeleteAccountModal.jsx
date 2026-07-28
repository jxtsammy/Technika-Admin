import { useState } from 'react';
import './DeleteAccount.css';

export default function DeleteAccountModal({ isOpen, onClose, onDeleteConfirm }) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const REQUIRED_PHRASE = "I understand and I want to delete my account";

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setConfirmationInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmationInput !== REQUIRED_PHRASE || deleting) return;
    setDeleting(true);
    setError('');
    try {
      await onDeleteConfirm?.();
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Top Header warning banner banner block */}
        <div className="delete-modal-header">
          <h3><i className="fa-solid fa-triangle-exclamation"></i> Delete Account Verification</h3>
          <button className="delete-modal-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="delete-modal-body">
          <p className="warning-text-primary">
            Are you sure that you want to delete your account? This will delete your personal account and projects on your account.
          </p>

          <p className="warning-text-secondary">
            Type <strong className="phrase-highlight">"{REQUIRED_PHRASE}"</strong> in the field below to confirm deletion. This action cannot be undone.
          </p>

          <form onSubmit={handleSubmit} className="delete-form-layout">
            <div className="delete-input-wrapper">
              <input
                type="text"
                value={confirmationInput}
                onChange={handleInputChange}
                placeholder="I understand and I want to delete my account"
                className="delete-confirmation-field"
                autoComplete="off"
              />
            </div>

            <div className="delete-modal-actions">
              {error && <span style={{ color: '#b3261e', fontSize: '0.85rem', marginRight: 'auto' }}>{error}</span>}
              <button type="button" className="btn-cancel-flat" onClick={onClose} disabled={deleting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-danger-confirm"
                disabled={confirmationInput !== REQUIRED_PHRASE || deleting}
              >
                {deleting ? 'Deleting…' : 'Permanently Delete Account'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}