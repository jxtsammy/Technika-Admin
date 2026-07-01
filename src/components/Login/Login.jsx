import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Added useNavigate to support form submission flows
import './Login.css';
import LoginImg from '../../assets/Rebrand.jpg';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', formData);

    // Process authentication here, then redirect:
    navigate('/admin');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-split-container">

        {/* Left Section: Interaction Form */}
        <div className="login-form-side">
          <div className="inner-form-box">

            <h1 className="login-main-heading">Welcome Admin!</h1>
            <p className="login-sub-heading">Enter your Credentials to access your workspace</p>

            <form onSubmit={handleLoginSubmit} className="auth-form-element" id="loginForm">

              {/* Email Entry */}
              <div className="form-input-wrapper">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Entry */}
              <div className="form-input-wrapper">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-pass-anchor">
                    forgot password
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Remember Tracker */}
              <div className="remember-checkbox-row">
                <label className="checkbox-custom-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">Remember for 30 days</span>
                </label>
              </div>

              {/* 2. Replaced button with Link tag */}
              <Link
                to="/admin"
                className="btn-solid-login"
                onClick={(e) => {
                  // Forces HTML5 required field validation to run before navigating
                  const form = document.getElementById('loginForm');
                  if (!form.checkValidity()) {
                    form.reportValidity();
                    e.preventDefault();
                  } else {
                    handleLoginSubmit(e);
                  }
                }}
              >
                Login
              </Link>

            </form>

          </div>
        </div>

        {/* Right Section: Illustrative Panel */}
        <div className="login-visual-side">
          <div className="visual-rounded-card">
            <img
              src={LoginImg}
              alt="Monstera Plant Layout"
              className="side-panel-artwork"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;