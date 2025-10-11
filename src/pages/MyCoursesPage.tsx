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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
        Loading your courses...
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium mt-8">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Courses
            </span>
          </h1>

          <Link
            to="/instructor/courses/create"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all"
          >
            + Create New Course
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <InstructorCourseCard
                key={course._id}
                course={course}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 p-12 rounded-xl border border-gray-200 shadow-inner">
            <p className="text-gray-600 text-lg mb-4">
              You haven’t created any courses yet.
            </p>
            <Link
              to="/instructor/courses/create"
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
            >
              Create Your First Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
