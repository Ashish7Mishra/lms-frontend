 // src/pages/DashboardPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMyEnrollments, type Enrollment } from "../services/enrollmentService";
import { getMyCourses } from "../services/courseService";
import type { Course } from "../types";
import ProgressCard from "../components/ProgressCard";
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  Users,
  Star,
  Activity,
} from "lucide-react";

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

  // --- Student Dashboard ---
  const renderStudentDashboard = () => {
    if (isLoading)
      return <p className="text-center text-gray-500 py-20 animate-pulse">Loading your courses...</p>;

    if (error)
      return <p className="text-center text-red-500 py-20">Error: {error}</p>;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Learning</h2>

        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enrollment) => (
              <ProgressCard key={enrollment._id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-2xl shadow-md border border-gray-100">
            <p className="text-gray-600">You are not enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
            >
              Browse Courses →
            </Link>
          </div>
        )}
      </div>
    );
  };

  // --- Instructor Dashboard (Professional Version) ---
  const renderInstructorDashboard = () => {
    if (isLoading)
      return <p className="text-center text-gray-500 py-20 animate-pulse">Loading dashboard...</p>;

    if (error)
      return <p className="text-center text-red-500 py-20">Error: {error}</p>;

    return (
      <div className="space-y-10">
        {/* Analytics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-md text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Total Courses</h3>
                <p className="text-4xl font-extrabold mt-2">{myCourses.length}</p>
              </div>
              <BookOpen className="w-10 h-10 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-md text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Total Students</h3>
                <p className="text-4xl font-extrabold mt-2">
                  {myCourses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)}
                </p>
              </div>
              <Users className="w-10 h-10 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-md text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Avg. Rating</h3>
                <p className="text-4xl font-extrabold mt-2">
                  {myCourses.length
                    ? (
                        myCourses.reduce((sum, c) => sum + (c.rating || 0), 0) /
                        myCourses.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <Star className="w-10 h-10 opacity-80" />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/instructor/courses/create"
            className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl shadow-md font-semibold hover:scale-[1.02] transition-all"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Create New Course
          </Link>
          <Link
            to="/instructor/my-courses"
            className="flex items-center justify-center bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-4 rounded-xl shadow-md font-semibold hover:scale-[1.02] transition-all"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" /> Manage My Courses
          </Link>
          <button
            disabled
            className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white py-4 rounded-xl shadow-md font-semibold cursor-default opacity-80"
          >
            <Activity className="w-5 h-5 mr-2" /> Analytics (Coming Soon)
          </button>
        </section>

        {/* Recently Created Courses */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recently Created Courses
          </h2>

          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.slice(0, 3).map((course) => (
                <Link
                  key={course._id}
                  to={`/instructor/courses/${course._id}/manage`}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={
                        course.thumbnail?.startsWith("http")
                          ? course.thumbnail
                          : `https://your-server-url.com/${course.thumbnail}`
                      }
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://img.freepik.com/free-vector/online-education-concept-illustration_114360-6279.jpg?w=826";
                      }}
                    />
                    <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                      {course.category || "General"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {course.description || "No description available."}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {course.enrolledCount || 0} Students
                      </span>
                      <span className="flex items-center text-yellow-500 text-sm font-medium">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400" />{" "}
                        {course.rating ? course.rating.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-600">
              You haven’t created any courses yet.
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {user?.name}
          </span>{" "}
          👋
        </h1>

        {user?.role === "Student" ? renderStudentDashboard() : renderInstructorDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;
