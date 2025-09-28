import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Unlock Your Potential.</h1>
        <p className="hero-subtitle">Learn & Grow with Learnify</p>
        <div className="hero-buttons">
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          <Link to="/register" className="btn btn-secondary">Become an Instructor</Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;