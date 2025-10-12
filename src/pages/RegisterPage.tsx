 import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { registerUser } from "../services/authService";
import { Mail, Lock, User, GraduationCap } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPopup, setShowPopup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { token, ...userData } = await registerUser(formData);
      login(userData, token);

      // Redirect based on role
      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "instructor":
          navigate("/instructor/dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-center">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-1">
              Glass <span className="text-orange-400">Morphism</span>
            </h2>
            <p className="text-gray-300 mb-8 tracking-wide text-sm">Register</p>

            {error && (
              <p className="text-red-400 text-sm font-medium mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-10 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="your mail here"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-10 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="your password here"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="w-full px-10 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Role */}
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-10 py-2 rounded-lg bg-white/20 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="student" className="text-gray-800">
                    Student
                  </option>
                  <option value="instructor" className="text-gray-800">
                    Instructor
                  </option>
                </select>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-400/90 text-gray-900 font-semibold py-2 rounded-lg hover:bg-orange-500 transition-all shadow-md"
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
