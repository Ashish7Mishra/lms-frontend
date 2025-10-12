 // src/pages/MyCoursesPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMyCourses, toggleCourseStatus } from "../services/courseService";
import type { Course } from "../types";
import InstructorCourseCard from "../components/InstructorCourseCard";

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

  const handleDeactivate = async (courseId: string) => {
    if (
      !token ||
      !window.confirm(
        "Are you sure you want to deactivate this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const updatedCourse = await toggleCourseStatus(courseId, token);
      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course._id === courseId ? updatedCourse : course
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading)
    return (
      <p className="text-center text-gray-500 py-20 animate-pulse">
        Loading your courses...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-20 text-lg">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            My{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <Link
            to="/instructor/courses/create"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:opacity-90 transition"
          >
            + Create New Course
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <InstructorCourseCard
                key={course._id}
                course={course}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-2xl shadow-md border border-gray-100 mt-8">
            <p className="text-gray-600 text-lg">
              You haven’t created any courses yet.
            </p>
            <Link
              to="/instructor/courses/create"
              className="mt-5 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
            >
              Create Your First Course →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
