 import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/authService";

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
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const avatarRef = useRef<HTMLDivElement | null>(null);

  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
  ];

  // Close avatar dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    try {
      const { token, ...userData } = await loginUser(formData);
      login(userData, token);
      setShowLoginModal(false);

      // Redirect based on role
      if (userData.role === "admin") navigate("/admin/dashboard");
      else if (userData.role === "instructor") navigate("/instructor/dashboard");
      else navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-indigo-600">LMS</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-4 lg:gap-6">
            {baseLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`px-8 py-2 rounded-full uppercase tracking-wider font-semibold transition duration-200 shadow-[inset_0_0_0_2px_#616467]
                      ${
                        isActive
                          ? "bg-[#616467] text-white"
                          : "text-black bg-transparent hover:bg-[#616467] hover:text-white"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}

            {!user && (
              <>
                <li>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-8 py-2 rounded-full uppercase tracking-wider font-semibold bg-transparent shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white transition"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-8 py-2 rounded-full uppercase tracking-wider font-semibold bg-transparent shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Avatar Menu */}
            {user && (
              <li className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full shadow-[inset_0_0_0_2px_#616467] bg-transparent hover:bg-[#616467] hover:text-white transition"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-700 transition-transform ${
                      avatarMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fadeIn">
                    <p className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 font-medium">
                      {user.name}
                    </p>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAvatarMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Mobile Button */}
          <button
            className="md:hidden p-2 text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* ===== MOBILE MENU ===== */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200 animate-fadeIn">
            <ul className="flex flex-col items-center space-y-3 py-4">
              {baseLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-2 text-gray-700 font-semibold rounded-full hover:bg-[#616467] hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {!user && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="block w-full px-6 py-2 text-center text-gray-700 font-semibold rounded-full border border-gray-400 hover:bg-[#616467] hover:text-white transition"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-6 py-2 text-center text-gray-700 font-semibold rounded-full border border-gray-400 hover:bg-[#616467] hover:text-white transition"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}

              {user && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-gray-700 font-semibold rounded-full hover:bg-[#616467] hover:text-white transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="block w-full px-6 py-2 text-center text-red-600 font-semibold rounded-full hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* ===== LOGIN MODAL ===== */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex justify-center items-center animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slideUp">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Sign In to LMS
            </h2>

            {loginError && (
              <div className="text-sm text-red-600 text-center mb-3">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>

            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== LOGOUT MODAL ===== */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-slideUp">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to logout of your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-[#616467] text-white font-semibold hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
