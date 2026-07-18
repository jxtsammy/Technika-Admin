import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="login-container">

      {/* Left Side: Marketing/Info Panel */}
      <div className="info-panel">
        <div className="info-content">
          <h1>Coordinate Teams track progress, and<br /> maintain seamless efficiency.</h1>
          <p>
            Streamline operations with a centralized workspace designed to
            monitor technician activities, assign and track tasks, and efficiently manage the onboarding of technicians and customers.
          </p>
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="form-panel">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Administrator Account</p>
          </div>

          <form ref={formRef} className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="checkbox-group">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Keep me signed in</label>
            </div>

            <Link
              to="/admin"
              className="submit-btn"
              onClick={(e) => {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }}
            >
              Sign in to Dashboard
            </Link>
          </form>
        </div>
      </div>

    </div>
  );
}