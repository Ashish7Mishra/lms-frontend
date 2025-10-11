// src/services/authService.ts

import apiService from './apiService';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'Student' | 'Instructor';
}
interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginData) => {
  try {
    const response = await apiService.post('/auth/login', credentials);
    // According to the API docs, the user data and token are in response.data.data
    return response.data.data; 
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Login failed.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const registerUser = async (userData: RegisterData) => {
  try {

    const response = await apiService.post('/auth/register', userData);
    
    // The API documentation says the actual data is in response.data.data
    return response.data; 
  } catch (error: any) {
    
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Registration failed.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

