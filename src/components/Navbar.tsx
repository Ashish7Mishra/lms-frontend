 import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="src/assets/logo.jpg"

            alt="LMS Logo"
            className="h-10 w-auto object-contain"
          

          />
        </Link>

        {/* --- Desktop Menu --- */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-6">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-md"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* --- Mobile Menu Button --- */}
        <button
          className="md:hidden p-2 text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* --- Mobile Dropdown Menu --- */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200 animate-slideDown">
          <ul className="flex flex-col items-center py-4 space-y-3">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                        : "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-md"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
