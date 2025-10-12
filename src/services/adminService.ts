// src/services/adminService.ts

import apiService from './apiService';
import type { DashboardData } from '../admin';
import type { User } from '../types'; 
// Re-export this for convenience in our pages
export type { DashboardData };

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: 'Student' | 'Instructor' | '';
  isActive?: 'true' | 'false' | '';
  search?: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: 'true' | 'false' | '';
  search?: string;
  instructorId?: string;
}

export const getUsers = async (token: string, filters: UserFilters): Promise<PaginatedUsersResponse> => {
  try {
    // Remove empty filter properties to keep the URL clean
    const cleanFilters: { [key: string]: any } = {};
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key as keyof UserFilters];
        if (value) {
          cleanFilters[key] = value;
        }
      }
    }

    const config = { 
      headers: { Authorization: `Bearer ${token}` },
      params: cleanFilters,
    };
    const response = await apiService.get('/admin/users', config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users.');
  }
};

// Function to get dashboard data
export const getDashboardData = async (token: string): Promise<DashboardData> => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await apiService.get('/admin/dashboard', config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data.');
  }
};

export const toggleUserStatus = async (userId: string, token: string): Promise<User> => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await apiService.patch(`/admin/users/${userId}/toggle-status`, {}, config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user status.');
  }
};
// We will add functions for users and courses here later
export const getCourses = async (token: string, filters: CourseFilters): Promise<PaginatedAdminCoursesResponse> => {
  try {
    const cleanFilters: { [key: string]: any } = {};
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key as keyof CourseFilters];
        if (value) {
          cleanFilters[key] = value;
        }
      }
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: cleanFilters,
    };
    const response = await apiService.get('/admin/courses', config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch courses.');
  }
};

export const toggleCourseStatus = async (courseId: string, token: string): Promise<AdminCourse> => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await apiService.patch(`/admin/courses/${courseId}/toggle-status`, {}, config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update course status.');
  }
};

export const updateUserRole = async (userId: string, newRole: 'Student' | 'Instructor', token: string): Promise<User> => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const body = { role: newRole };
    // Assuming the endpoint is '/admin/users/:id/update-role'
    const response = await apiService.patch(`/admin/users/${userId}/update-role`, body, config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user role.');
  }
};