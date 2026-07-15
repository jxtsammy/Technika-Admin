import { useState, useRef } from 'react';
import './Profile.css';

export default function SettingsScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Samuel Sallo',
    email: 'ssallo1012@gmail.com',
    phone: '+233 (0) 2572-56751',
  });

  // Set to null initially so we can render the default profile icon if empty
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setAvatar(objectURL);
    }
  };

  return (
    <div className="settings-container">
      {/* Banner */}
      <div className="banner">
      </div>

      {/* Profile Header Block */}
      <div className="profile-header">
        <div className="profile-meta">
          {/* Large Avatar: Renders image if selected, else fallback to standard profile icon */}
          <div className="avatar-large-container">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-large" />
            ) : (
              <div className="avatar-large-placeholder">
                <i className="fa-solid fa-user"></i>
              </div>
            )}
          </div>

          <div className="profile-titles">
            <div className="name-badge-row">
              <h1>{formData.fullName}</h1>
              <span className="badge-pro">Administrator</span>
            </div>
            <p className="profile-email">{formData.email}</p>
          </div>
        </div>

        {/* Right-aligned Small Edit Button */}
        <div className="header-actions">
          <button onClick={handleToggleEdit} className="btn-primary">
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Main Content Form */}
      <div className="settings-content">
        <div className="content-sidebar">
          <h2>Personal Info</h2>
          <p>You can change your personal information settings here.</p>
        </div>

        <div className="form-card">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <i className="fa-regular fa-user"></i>
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <i className="fa-solid fa-phone"></i>
                </span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Account Type (Strictly locked to Admin) */}
            <div className="form-group">
              <label>Account Type</label>
              <div className="input-wrapper locked">
                <input type="text" value="Admin" disabled className="cursor-not-allowed" />
                <span className="dropdown-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>
            </div>
          </div>

          {/* Change Avatar Section */}
          <div className="avatar-section">
            <label className="section-label">Change Avatar</label>
            <div className="avatar-upload-row">
              {/* Small Avatar Form Preview Fallback */}
              {avatar ? (
                <img src={avatar} alt="Current avatar" className="avatar-small" />
              ) : (
                <div className="avatar-small-placeholder">
                  <i className="fa-solid fa-user"></i>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <div className="dropzone">
                <div className="upload-icon">
                  <i className="fa-solid fa-file-arrow-up"></i>
                </div>
                <p className="upload-text">
                  <button type="button" onClick={handleUploadClick} className="btn-link">Click here</button> to upload your file or drag.
                </p>
                <p className="upload-subtext">Supported Format: SVG, JPG, PNG (10mb each)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}