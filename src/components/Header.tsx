import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const avatarRef = useRef<HTMLLIElement | null>(null);

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
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    return user.role === "Admin" ? "/admin/dashboard" : "/dashboard";
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-800">LMS</span>
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <ul className="hidden md:flex items-center gap-4 lg:gap-6">
            {baseLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`px-8 py-2 rounded-full uppercase tracking-wider font-semibold transition-all duration-300 shadow-[inset_0_0_0_2px_#616467] ${
                      isActive
                        ? "bg-[#616467] text-white scale-105"
                        : "text-black bg-transparent hover:bg-[#616467] hover:text-white hover:scale-105 hover:shadow-lg"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}

            {/* Instructor link */}
            {user?.role === "Instructor" && (
              <li>
                <Link
                  to="/instructor/my-courses"
                  className={`px-8 py-2 rounded-full uppercase tracking-wider font-semibold transition-all duration-300 shadow-[inset_0_0_0_2px_#616467] ${
                    location.pathname === "/instructor/my-courses"
                      ? "bg-[#616467] text-white scale-105"
                      : "text-black bg-transparent hover:bg-[#616467] hover:text-white hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  My Courses
                </Link>
              </li>
            )}

            {/* ===== AUTH BUTTONS ===== */}
            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-8 py-2 rounded-full uppercase tracking-wider font-semibold bg-transparent shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-8 py-2 rounded-full uppercase tracking-wider font-semibold bg-transparent shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* ===== AVATAR MENU ===== */}
            {user && (
              <li className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full shadow-[inset_0_0_0_2px_#616467] bg-transparent hover:bg-[#616467] hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
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
                      to={getDashboardPath()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#616467] hover:text-white transition-colors duration-200"
                      onClick={() => setAvatarMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* ===== MOBILE TOGGLE ===== */}
          <button
            className="md:hidden p-2 text-gray-700 focus:outline-none hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* ===== MOBILE MENU ===== */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200 animate-fadeIn">
            <ul className="flex flex-col items-center space-y-3 py-4">
              {baseLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name} className="w-full px-4">
                    <Link
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-6 py-2 text-center font-semibold rounded-full shadow-[inset_0_0_0_2px_#616467] transition-all duration-300 ${
                        isActive
                          ? "bg-[#616467] text-white"
                          : "text-gray-700 bg-transparent hover:bg-[#616467] hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}

              {user?.role === "Instructor" && (
                <li className="w-full px-4">
                  <Link
                    to="/instructor/my-courses"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-2 text-center font-semibold rounded-full shadow-[inset_0_0_0_2px_#616467] transition-all duration-300 ${
                      location.pathname === "/instructor/my-courses"
                        ? "bg-[#616467] text-white"
                        : "text-gray-700 bg-transparent hover:bg-[#616467] hover:text-white"
                    }`}
                  >
                    My Courses
                  </Link>
                </li>
              )}

              {!user && (
                <>
                  <li className="w-full px-4">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-6 py-2 text-center text-gray-700 font-semibold rounded-full shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white transition-all duration-300"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="w-full px-4">
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-6 py-2 text-center text-gray-700 font-semibold rounded-full shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white transition-all duration-300"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}

              {user && (
                <>
                  <li className="w-full px-4">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-center text-gray-700 font-semibold rounded-full shadow-[inset_0_0_0_2px_#616467] hover:bg-[#616467] hover:text-white transition-all duration-300"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="w-full px-4">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="block w-full px-6 py-2 text-center text-red-600 font-semibold rounded-full shadow-[inset_0_0_0_2px_#ef4444] hover:bg-red-500 hover:text-white transition-all duration-300"
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
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-[#616467] text-white font-semibold hover:bg-[#4a4d4f] hover:scale-105 transition-all duration-200"
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