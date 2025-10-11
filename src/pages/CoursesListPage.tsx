// src/pages/CoursesListPage.tsx

import { useState, useEffect } from 'react';
import { getAllCourses } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';

const CoursesListPage = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    window.scrollTo(0, 0); 
    
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllCourses(token, currentPage);
        setCourses(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [token, currentPage]);

  const handleNextPage = () => {

    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {

    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>
              
              <span className="font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center bg-gray-50 p-8 rounded-lg mt-8">
            <p className="text-gray-600">No courses available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesListPage;