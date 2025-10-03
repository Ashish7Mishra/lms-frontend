// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand-logo">
          Mini-LMS
        </Link>
        <ul className="nav-links">
          {/* Add a general "Courses" link for everyone to see */}
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          
          {user ? (
            // If user is logged in...
            <>
              {user.role === 'Student' && (
                <li>
                  <Link to="/student/dashboard">Dashboard</Link>
                </li>
              )}
              {user.role === 'Instructor' && (
                <li>
                  <Link to="/instructor/dashboard">Dashboard</Link>
                </li>
              )}

              <li>
                <span>Hello, {user.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;