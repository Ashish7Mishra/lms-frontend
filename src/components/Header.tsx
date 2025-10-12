// src/components/Header.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout for a clean experience
  };

  // Helper function to determine the correct dashboard path based on the user's role
  const getDashboardPath = () => {
    if (!user) return '/dashboard'; // Default fallback

    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Instructor':
      case 'Student':
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Link */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Mini-LMS
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {/* Publicly visible link */}
          <Link to="/courses" className="text-gray-600 hover:text-blue-500">
            Courses
          </Link>

          {isAuthenticated ? (
            // --- Authenticated User Links ---
            <>
              {/* Instructor-only link */}
              {user?.role === 'Instructor' && (
                <Link 
                  to="/instructor/my-courses" 
                  className="text-gray-600 hover:text-blue-500 font-semibold"
                >
                  My Courses
                </Link>
              )}

              {/* Dynamic Dashboard Link for all authenticated roles */}
              <Link to={getDashboardPath()} className="text-gray-600 hover:text-blue-500">
                Dashboard
              </Link>

              {/* User Greeting */}
              <span className="text-gray-700">Hello, {user?.name}</span>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // --- Guest User Links ---
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-500">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;