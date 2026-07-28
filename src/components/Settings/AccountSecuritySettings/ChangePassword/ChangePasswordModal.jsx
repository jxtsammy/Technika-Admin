import { useState } from 'react';
import './ChangePassword.css';
import securityGraphic from '../../../../assets/passwordChnage.jpg'; // Replace with your local asset reference
import { usersApi } from '../../../../api/services';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validatePassword = (password) => {
    // Requires at least 8 characters, containing numbers and alphabets
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError('New password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await usersApi.changePassword(formData.currentPassword, formData.newPassword);
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Close Icon Button */}
        <button className="modal-close-icon" onClick={onClose} aria-label="Close Modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Left Side: Dynamic Form Area */}
        <div className="modal-form-side">
          {!success ? (
            <>
              <h2 className="modal-title">Update Your Password</h2>
              <p className="modal-subtitle">Ensure your account stays secure by using a strong authorization secret key phrase.</p>

              <form onSubmit={handleSubmit} className="password-form">
                {error && <div className="modal-error-alert">{error}</div>}

                <div className="modal-input-group">
                  <label>Current Password</label>
                  <div className="modal-input-wrapper">
                    <span className="modal-field-icon"><i className="fa-solid fa-lock-open"></i></span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="modal-input-group">
                  <label>New Password</label>
                  <div className="modal-input-wrapper">
                    <span className="modal-field-icon"><i className="fa-solid fa-lock"></i></span>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="modal-input-group">
                  <label>Confirm New Password</label>
                  <div className="modal-input-wrapper">
                    <span className="modal-field-icon"><i className="fa-solid fa-shield-halved"></i></span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button type="submit" className="modal-submit-btn" disabled={submitting}>
                  {submitting ? 'Updating…' : 'Update Password'} <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </>
          ) : (
            <div className="success-state-view">
              <div className="success-icon-badge"><i className="fa-solid fa-circle-check"></i></div>
              <h2 className="modal-title">Password Changed!</h2>
              <p className="modal-subtitle">Your credentials have been securely updated. Use your new keys next time you log in.</p>
              <button className="modal-submit-btn fallback-green" onClick={onClose}>
                <i className="fa-solid fa-arrow-left"></i> Go Back
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Visual Graphic Panel */}
        <div className="modal-graphic-side">
          <img
            src={securityGraphic}
            alt="Security Protection View"
            className="modal-embedded-img"
            onError={(e) => {
              // Fallback if image asset isn't ready locally
              e.target.style.display = 'none';
              e.target.parentNode.classList.add('graphic-fallback');
            }}
          />
        </div>

      </div>
    </div>
  );
}