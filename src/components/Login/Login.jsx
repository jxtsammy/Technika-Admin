import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    console.log({ email, password, rememberMe });

    // Simulating authentication delay before navigating
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="login-container">

      {/* Left Side: Marketing/Info Panel */}
      <div className="info-panel">
        <div className="info-content">
          <h1>Coordinate Teams track progress, and maintain seamless efficiency.</h1>
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

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
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
                required
                disabled={isLoading}
              />
            </div>

            <div className="checkbox-group">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Keep me signed in</label>
            </div>

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}