 // src/pages/RegisterPage.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { User, Mail, Lock } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student" as "Student" | "Instructor",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    else if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password))
      newErrors.password =
        "Password must contain at least one letter and one number.";

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setApiError(null);
    setIsLoading(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        
        {/* Left Section - Form */}
        <div className="flex w-full flex-col justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-10 text-white md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold">Create Your Account</h2>

          {apiError && (
            <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div className="relative">
    
              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-full px-12 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-100">{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
             
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-full px-12 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-100">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              
              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="Password (8+ chars, at least 1 number)"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-full px-12 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-100">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-white/90 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            {/* Terms */}
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" required className="h-4 w-4 rounded border-white" />
              <span>
                I agree to{" "}
                <a
                  href="#"
                  className="underline text-white font-medium hover:text-purple-200"
                >
                  Terms & Conditions
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-white underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Section - Info */}
        <div className="hidden w-1/2 flex-col items-center justify-center p-10 md:flex">
          <h3 className="text-2xl font-semibold text-gray-800">
            Join Our Learning Community
          </h3>
          <p className="mt-4 text-center text-gray-600">
            Learn, teach, and grow together with thousands of passionate learners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
