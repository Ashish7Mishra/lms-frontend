 import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getMyEnrollments,
  type Enrollment,
} from "../services/enrollmentService";
import { getMyCourses } from "../services/courseService";
import type { Course } from "../types";
import ProgressCard from "../components/ProgressCard";

const DashboardPage = () => {
  const { user, token } = useAuth();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        if (user.role === "Student") {
          const enrollmentData = await getMyEnrollments(token);
          setEnrollments(enrollmentData);
        }
        if (user.role === "Instructor") {
          const courseData = await getMyCourses(token);
          setMyCourses(courseData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, token]);

  // ===========================
  // STUDENT DASHBOARD
  // ===========================
  const renderStudentDashboard = () => {
    if (isLoading)
      return <p className="text-center text-gray-500">Loading your courses...</p>;
    if (error)
      return <p className="text-center text-red-500">Error: {error}</p>;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">My Learning</h2>

        {enrollments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <ProgressCard key={enrollment._id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border border-gray-100 shadow-sm p-10 rounded-xl">
            <p className="text-gray-600 mb-4">
              You are not enrolled in any courses yet.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    );
  };

  // ===========================
  // INSTRUCTOR DASHBOARD
  // ===========================
  const renderInstructorDashboard = () => {
    if (isLoading)
      return <p className="text-center text-gray-500">Loading dashboard...</p>;
    if (error)
      return <p className="text-center text-red-500">Error: {error}</p>;

    return (
      <div className="space-y-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Courses */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-md flex flex-col justify-center">
            <h3 className="text-lg font-medium opacity-90">
              Total Courses Created
            </h3>
            <p className="text-5xl font-bold mt-2">{myCourses.length}</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/instructor/my-courses"
                className="flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                <span className="bg-indigo-50 text-indigo-700 text-sm px-2.5 py-1 rounded-lg mr-2">
                  📚
                </span>
                Manage All Courses →
              </Link>

              <Link
                to="/instructor/courses/create"
                className="flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
              >
                <span className="bg-emerald-50 text-emerald-700 text-sm px-2.5 py-1 rounded-lg mr-2">
                  ➕
                </span>
                Create a New Course →
              </Link>
            </div>
          </div>
        </div>

        {/* Recently Created Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recently Created Courses
          </h2>
          {myCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.slice(0, 3).map((course) => (
                <Link
                  key={course._id}
                  to={`/instructor/courses/${course._id}/manage`}
                  className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden"
                >
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {course.category || "General"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-gray-100 shadow-sm p-10 rounded-xl">
              <p className="text-gray-600">
                You haven’t created any courses yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            {user?.name}
          </span>
          !
        </h1>

        {user?.role === "Student"
          ? renderStudentDashboard()
          : renderInstructorDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;
