import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-200 mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            About LMS
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Learning Management System helps you learn new skills, grow
            professionally, and achieve your dreams with curated expert courses.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-600 transition">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-600 transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-600 transition">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Contact</h3>
          <p className="text-sm text-gray-600">
            Email:{" "}
            <a
              href="mailto:support@learnify.com"
              className="hover:text-blue-600"
            >
              support@lms.utkal.labs.com
            </a>
          </p>
          <p className="text-sm text-gray-600">Phone: +1 (555) 123-4567</p>
        </div>

        {/* Stay Updated */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            Stay Updated
          </h3>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 text-gray-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} LMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
