// src/pages/LoginPage.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/authService";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { token, ...userData } = await loginUser(formData);
      login(userData, token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-center text-sm text-pink-100 max-w-sm">
            Continue your learning journey. Let’s get you signed in and back to
            growing 🚀
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign In to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LMS
            </span>
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <FormInput
                label=""
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="pl-10"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FormInput
                label=""
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="pl-10"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Footer Link */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
