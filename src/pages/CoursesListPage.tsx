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

  const COURSES_PER_PAGE = 8; // ✅ Only 8 cards per page (4x2 layout)

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAllCourses(token);
        const activeCourses = response.data.filter((course) => course.isActive);

        // Manual pagination (client-side)
        const total = Math.ceil(activeCourses.length / COURSES_PER_PAGE);
        setTotalPages(total);

        const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
        const paginated = activeCourses.slice(
          startIndex,
          startIndex + COURSES_PER_PAGE
        );

        setCourses(paginated);
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

  // --- Loading & Error States ---
 if (isLoading)
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 font-medium text-base">Loading Courses</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Page Header ===== */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Learn new skills and boost your career with our expert-led programs.
          </p>
        </div>

        {/* ===== Course Grid ===== */}
        {courses.length > 0 ? (
          <>
            <div
              className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                gap-8 
                justify-items-center
              "
            >
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="w-full max-w-[300px] flex justify-center"
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            {/* ===== Pagination ===== */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-14 space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold shadow-sm hover:bg-gray-200 hover:shadow transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <span className="text-gray-700 font-semibold text-lg">
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