import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './Security.css';
import ChangePasswordModal from './ChangePassword/ChangePasswordModal';
import DeleteAccountModal from './DeleteAccount/DeleteAccountModal';
import { clearSession } from '../../../api/client';
import { usersApi } from '../../../api/services';

export default function AccountSecurity() {
  const [isPassordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const navigate = useNavigate(); // 2. Initialize the navigation hook

  const handleSignOut = () => {
    clearSession();
    navigate('/'); // 3. Navigate home
  };

  const handleDeleteAccount = async () => {
    await usersApi.deleteAccount();
    clearSession();
    navigate('/');
  };

  return (
    <div className="security-section-container">
      {/* Title stacked cleanly above the main content card */}
      <div className="content-header-block">
        <h2>Account Security</h2>
        <p>Manage your account password, active sessions, and access parameters.</p>
      </div>

      {/* Main Security Cards Wrapper */}
      <div className="security-card-container">

        {/* Sign-in Methods Block */}
        <div className="security-block">
          <div className="block-header">
            <h3><i className="fa-solid fa-key"></i> Sign-in methods</h3>
            <p>Customize how you access your account.</p>
          </div>
          <div className="block-row">
            <div className="row-meta">
              <span className="row-icon"><i className="fa-solid fa-lock"></i></span>
              <div>
                <h4>Password</h4>
                <p className="muted-text">Configured</p>
              </div>
            </div>
            <button className="btn-secondary" onClick={() => setIsPasswordModalOpen(true)}>Manage</button>
          </div>
        </div>

        {/* Sessions Block */}
        <div className="security-block">
          <div className="block-header">
            <h3><i className="fa-solid fa-right-from-bracket"></i>Account Sign-Out</h3>
            <p>Signing out will end your current session and require you to log in again to access your account.</p>
          </div>
          <div className="block-row actions-only">
            {/* 4. Attach handleSignOut to onClick */}
            <button className="btn-danger-outline" onClick={handleSignOut}>
              Sign-Out Account
            </button>
          </div>
        </div>

        {/* Danger Zone Block */}
        <div className="security-block danger-zone">
          <div className="block-header">
            <h3><i className="fa-solid fa-triangle-exclamation"></i> Danger zone</h3>
            <p>The actions below are permanent and irreversible.</p>
          </div>
          <div className="block-row">
            <div className="row-meta">
              <span className="row-icon"><i className="fa-regular fa-trash-can"></i></span>
              <div>
                <h4>Delete your account</h4>
                <p className="muted-text">Delete your personal account, projects, and activity.</p>
              </div>
            </div>
            <button className="btn-white-action" onClick={() => setIsDeleteAccountModalOpen(true)}>
              Start <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {/* Tip Box inside Danger Zone */}
          <div className="tip-box">
            <p><i className="fa-solid fa-circle-info"></i> <strong>Tip</strong></p>
            <p className="tip-text">
            This action is permanent. Deleting your account will remove your profile, data, and all associated information.You will not be able to restore it after confirmation.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Insert the modal element at the bottom of your component wrapper */}
      <ChangePasswordModal
        isOpen={isPassordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onDeleteConfirm={handleDeleteAccount}
      />
    </div>
  );
}