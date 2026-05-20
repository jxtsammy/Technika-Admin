import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Illustration from '../../assets/img.png';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Authentication logic can go here
    console.log('Login Data:', formData);

    // Navigate to dashboard
    navigate('/admin');
  };

  return (
    <section className="login-page">
      <div className="login-card">

        {/* Left Column: Login Form */}
        <div className="login-form-area">
          <div className="form-container">

            <h1 className="form-title">Welcome back</h1>

            <p className="form-subtitle">
              Login now to access your dashboard!
            </p>

            <form onSubmit={handleSubmit}>

              {/* Email Input */}
              <div className="input-group">
                <label htmlFor="email">Admin Email</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label htmlFor="password">Password</label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary">
                Sign in
              </button>

            </form>

          </div>

          {/*
          <div className="form-footer">
            <i className="far fa-envelope"></i>
            <span>Help@Aura.com</span>
          </div>
          */}
        </div>

        {/* Right Column: Illustration */}
        <div className="login-visual-area">

          <img
            src={Illustration}
            alt="Dashboard Illustration"
            className="panel-artwork"
          />

        </div>

      </div>
    </section>
  );
};

export default Login;