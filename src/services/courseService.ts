// src/services/courseService.ts

import apiService from './apiService';
import type { PaginatedCoursesResponse, Course, Lesson } from '../types'; // Import our new type
 // Import our new type

// Function to get all courses. It can optionally accept a token.
export const getAllCourses = async (token: string | null): Promise<PaginatedCoursesResponse> => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiService.get('/courses', config);

    // The API doc says the paginated object is in response.data.data
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch courses.');
    }
    throw new Error('An unexpected error occurred while fetching courses.');
  }
};

export const getCourseById = async (courseId: string, token: string | null): Promise<Course> => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiService.get(`/courses/${courseId}`, config);
    // Assuming the single course object is directly in response.data.data
    return response.data.data; 
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch course details.');
    }
    throw new Error('An unexpected error occurred while fetching course details.');
  }
};

export const getLessonsByCourseId = async (courseId: string, token: string | null): Promise<Lesson[]> => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    // According to docs, the endpoint is /lessons/course/:courseId
    const response = await apiService.get(`/lessons/course/${courseId}`, config);
    // And the lessons array is in response.data.data.data
    return response.data.data.data; 
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch lessons.');
    }
    throw new Error('An unexpected error occurred while fetching lessons.');
  }
};

export const getMyCourses = async (token: string): Promise<Course[]> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.get('/courses/my-courses', config);
    // The structure might be nested, so we'll check common patterns
    const courses = response.data?.data?.data || response.data?.data || [];
    return courses;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch your courses.');
    }
    throw new Error('An unexpected error occurred while fetching your courses.');
  }
};

export const createCourse = async (courseData: FormData, token: string): Promise<Course> => {
  try {
    const config = {
      headers: {
        // We must set the Content-Type for file uploads
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.post('/courses', courseData, config);
    return response.data.data; // Assuming API returns the new course object in data.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to create the course.');
    }
    throw new Error('An unexpected error occurred while creating the course.');
  }
};

export const updateCourse = async (courseId: string, courseData: FormData, token: string): Promise<Course> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.put(`/courses/${courseId}`, courseData, config);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to update the course.');
    }
    throw new Error('An unexpected error occurred while updating the course.');
  }
};