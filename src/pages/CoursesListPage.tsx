 // src/pages/CoursesListPage.tsx

import { useState, useEffect } from "react";
import { getAllCourses } from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";
import type { Course } from "../types";
import CourseCard from "../components/CourseCard";

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
        const activeCourses = response.data.filter((course) => course.isActive);
        setCourses(activeCourses);
        setTotalPages(response.pagination.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [token, currentPage]);

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading)
    return (
      <p className="text-center text-gray-500 py-20 text-lg animate-pulse">
        Loading courses...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-20 text-lg">
        Error: {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Learn new skills and boost your career with our expert-led programs.
          </p>
        </div>

        {/* 4 x 2 Grid Layout */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-6 justify-items-center">
              {courses.map((course) => (
                <div key={course._id} className="w-[280px]">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold shadow-sm hover:bg-gray-200 hover:shadow transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <span className="text-gray-700 font-semibold">
                  Page{" "}
                  <span className="text-blue-600">{currentPage}</span> of{" "}
                  {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-white p-12 rounded-2xl shadow-md mt-8">
            <p className="text-gray-600 text-lg">
              No courses available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesListPage;
