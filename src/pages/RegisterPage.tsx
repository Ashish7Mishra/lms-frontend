// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { registerUser } from '../services/authService'; 

const RegisterPage = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student' as 'Student' | 'Instructor', 
  });

  // State for API request status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setError(null); 
    setIsLoading(true); 

    try {
      const result = await registerUser(formData);
      console.log('Registration successful:', result);

      setTimeout(() => {
        navigate('/login');
      }, 1500); 

    } catch (err: any) {
      setError(err.message); 
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create your Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <FormInput
            label="Full Name" id="name" name="name" type="text"
            required value={formData.name} onChange={handleChange} disabled={isLoading}
          />
          <FormInput
            label="Email Address" id="email" name="email" type="email"
            required value={formData.email} onChange={handleChange} disabled={isLoading}
          />
          <FormInput
            label="Password" id="password" name="password" type="password"
            required minLength={6} value={formData.password} onChange={handleChange} disabled={isLoading}
          />
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
            <select
              id="role" name="role" required value={formData.role}
              onChange={handleChange} disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>
          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;