 import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200 mt-16">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            About Utkal Labs LMS
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Learn, grow, and achieve with Utkal Labs’ LMS — designed to help you
            master new skills and reach your professional goals with expert-led
            courses.
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
              href="mailto:support@utkallabs.com"
              className="hover:text-blue-600"
            >
              support@utkallabs.com
            </a>
          </p>
          <p className="text-sm text-gray-600">Phone: +91 98765 43210 / 9314239675</p>
        </div>

        {/* Stay Updated + Social */}
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
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-5 mt-5 text-gray-600">
            <a
              href="https://www.facebook.com/utkallabsindia/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/UtkalLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-500 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/utkal-labs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/utkallabs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="font-semibold">Utkal Labs LMS</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
