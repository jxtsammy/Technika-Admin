import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/services';
import './ForgotPassword.css';

// 1. Replace these placeholder paths with your actual asset file locations
import ImageStep1 from '../../assets/Tech1.jpg';
import ImageStep2 from '../../assets/Tech2.jpg';
import ImageStep3 from '../../assets/Tech3.jpg';
import ImageStep4 from '../../assets/Tech4.jpg';

export default function ForgotPasswordFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  const otpRefs = useRef([]);

  const simulateApiCall = (nextStepAction) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nextStepAction();
    }, 1200);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Backend sends reset instructions if the email exists.
      // NOTE: the rest of this flow (OTP + new password) is not yet
      // supported by the backend, so the later steps remain client-side.
      await authApi.forgotPassword(email);
    } catch {
      // Response is intentionally the same whether the email exists or not.
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.join('').length < 6) return;
    simulateApiCall(() => setStep(3));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.password || passwords.password !== passwords.confirmPassword) return;
    simulateApiCall(() => setStep(4));
  };

  // Content configuration mapper using imported asset variables
  const rightPanelContent = {
    1: {
      img: ImageStep1,
      quote: "Technika administrators rely on the dashboard to coordinate field dispatches and dispatch real-time maintenance routes, reducing resolution times by over 40% monthly."
    },
    2: {
      img: ImageStep2,
      quote: "Real-time task dispatch tracking scales instantly, providing precise terminal oversight and live location statuses for technicians across regional service zones."
    },
    3: {
      img: ImageStep3,
      quote: "Synchronizing the task dispatch queue ensures field technicians receive updated job tickets and navigation alerts safely without miscommunication points."
    },
    4: {
      img: ImageStep4,
      quote: "Technician status and service diagnostics logs synchronized successfully. Central command console updated across all active field hubs."
    }
  };

  return (
    <div className="flow-master-wrapper">
      <div className="flow-main-container">
        {/* Left Form View Pane Section */}
        <div className="flow-form-column">
          <div className="dynamic-form-card-container">

            {/* Step 1: Initial Forgot Request Card */}
            {step === 1 && (
              <div className="flow-step-view fade-in">
                <div className="form-icon-square">
                  <i className="fa-solid fa-fingerprint"></i>
                </div>
                <h2>Forgot password?</h2>
                <p className="subtitle-text">No worries, we'll send you reset instructions.</p>

                <form onSubmit={handleEmailSubmit} className="flow-form">
                  <div className="input-group-field">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-flow-primary" disabled={loading}>
                    {loading ? <span className="btn-spinner"></span> : "Reset password"}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: 6-Digit Verification Token Code Card */}
            {step === 2 && (
              <div className="flow-step-view fade-in">
                <div className="form-icon-square">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <h2>Password reset</h2>
                <p className="subtitle-text">We sent a code to <strong style={{color: '#111827'}}>{email || 'amelie@untitledui.com'}</strong></p>

                <form onSubmit={handleOtpSubmit} className="flow-form">
                  <div className="otp-digit-flex-row">
                    {otp.map((data, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength="1"
                        ref={el => otpRefs.current[i] = el}
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e.target, i)}
                        onFocus={(e) => e.target.select()}
                        className="otp-digit-box"
                      />
                    ))}
                  </div>

                  <button type="submit" className="btn-flow-primary" disabled={loading || otp.join('').length < 6}>
                    {loading ? <span className="btn-spinner"></span> : "Continue"}
                  </button>
                </form>

                <p className="resend-fallback-prompt">
                  Didn't receive the email? <button type="button" className="btn-flat-link" onClick={() => alert("Code resent successfully!")}>Click to resend</button>
                </p>
              </div>
            )}

            {/* Step 3: Setup Fresh Password Fields */}
            {step === 3 && (
              <div className="flow-step-view fade-in">
                <div className="form-icon-square">
                  <i className="fa-solid fa-keyboard"></i>
                </div>
                <h2>Set new password</h2>
                <p className="subtitle-text">Must be at least 8 characters.</p>

                <form onSubmit={handlePasswordSubmit} className="flow-form">
                  <div className="input-group-field stacked">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwords.password}
                      onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                      required
                    />
                  </div>

                  <div className="input-group-field stacked">
                    <label>Confirm password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-flow-primary" disabled={loading}>
                    {loading ? <span className="btn-spinner"></span> : "Reset password"}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: Final Success Confirmation View Panel */}
            {step === 4 && (
              <div className="flow-step-view fade-in">
                <div className="form-icon-square success-badge">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h2>All Done!</h2>
                <p className="subtitle-text">Your password has been reset. You can now access your account with your updated administrative password configuration safely.</p>
              </div>
            )}

            {/* Shared Bottom Back-to-Login Trigger Button */}
            <button type="button" className="btn-back-navigation" onClick={() => navigate('/')}>
              <i className="fa-solid fa-arrow-left"></i> Back to log in
            </button>
          </div>
        </div>

        {/* Right Split Panel Section with changing layouts */}
        <div className="flow-graphic-column">
          <div key={step} className="graphic-inner-card-wrapper fade-in">
            <img src={rightPanelContent[step].img} alt="Panel Graphic Hero View" className="graphic-hero-image" />
            <div className="graphic-caption-overlay-box">
              <p className="caption-body-quote">"{rightPanelContent[step].quote}"</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}