 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/authService';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        
        {/* Left Section - Form */}
        <div className="flex w-full flex-col justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-10 text-white md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold">Welcome Back!</h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-700 bg-white rounded-full p-1 w-6 h-6" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Email Address"
                className="w-full rounded-full px-12 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-700 bg-white rounded-full p-1 w-6 h-6" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Password"
                className="w-full rounded-full px-12 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <span>Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-white underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Section - Info */}
        <div className="hidden w-1/2 flex-col items-center justify-center p-10 md:flex">
          <h3 className="text-2xl font-semibold text-gray-800">Glad to see you again!</h3>
          <p className="mt-4 text-center text-gray-600">
            Welcome back! Please log in to continue your learning journey with us. Stay motivated and keep growing 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
