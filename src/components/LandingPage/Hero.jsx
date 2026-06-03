import './Hero.css';
// 1. Import your panel image from assets
import HeroMockup from '../../assets/people.png';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">

        {/* Main Typography Content */}
        <h1 className="hero-title">
          Coordinate <span className="highlight-badge">Teams</span> <br />
          track progress, and <br /> maintain seamless <br /> efficiency.
        </h1>

        <p className="hero-subtitle">
          Streamline operations with a centralized workspace designed to
          monitor technician activities, assign and track tasks, and efficiently manage the onboarding of technicians and customers.
        </p>

        {/* Action & Social Proof Row */}
        <div className="hero-actions-row">
          <button className="btn-get-started">
            Admin Signin
          </button>

          <div className="user-proof-block">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="Client 1" className="proof-avatar" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="Client 2" className="proof-avatar" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80" alt="Client 3" className="proof-avatar" />
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=60&q=80" alt="Client 4" className="proof-avatar" />
            </div>
            <div className="proof-text">
              <span className="proof-count">1000+ Technicians</span>
              <span className="proof-region">Ghana, Africa</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Mockup panel image anchored strictly to the container bottom */}
      <div className="hero-mockup-wrapper">
        <img
          src={HeroMockup}
          alt="Technika Dashboard Panel"
          className="hero-bottom-mockup"
        />
      </div>
    </section>
  );
};

export default HeroSection;