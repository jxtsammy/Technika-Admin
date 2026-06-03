import { Link } from 'react-router-dom'; // 1. Import Link from react-router-dom
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="landing-navbar">
      <div className="navbar-container">

        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          Technika-Administrator
        </Link>

        {/* Right CTA Button */}
        <div className="navbar-cta">
          <Link to="/login" className="btn-outline-contact">
            Admin Login
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;