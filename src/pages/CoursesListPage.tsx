// src/pages/CoursesListPage.tsx

import { useState, useEffect } from 'react';
import { getAllCourses } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';

const CoursesListPage = () => {
  const { token } = useAuth(); 
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllCourses(token);
        setCourses(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [token]); // Re-fetch if the token changes (e.g., user logs in/out)

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Our Courses</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No courses available at the moment.</p>
      )}
    </div>
  );
};

export default CoursesListPage;