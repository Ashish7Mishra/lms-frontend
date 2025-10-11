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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Explore Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            Courses
          </span>
        </h1>

        {courses.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                >
                  &larr; Previous
                </button>

                <span className="font-semibold text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-white shadow-md border border-gray-100 p-10 rounded-2xl mt-12">
            <p className="text-gray-600 text-lg">
              No courses available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesListPage;
