// src/pages/MyCoursesPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyCourses } from '../services/courseService';
import type { Course } from '../types';
import InstructorCourseCard from '../components/InstructorCourseCard';

const MyCoursesPage = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchCourses = async () => {
        try {
          setIsLoading(true);
          const data = await getMyCourses(token);
          setCourses(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourses();
    }
  }, [token]);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading your courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link
          to="/instructor/courses/create" // We will build this page next
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
        >
          + Create New Course
        </Link>
      </div>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <InstructorCourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-600">You haven't created any courses yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;