import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyEnrollments, type Enrollment } from '../services/enrollmentService';
import { getMyCourses, getEnrolledStudents } from '../services/courseService';
import type { Course } from '../types';
import ProgressCard from '../components/ProgressCard';
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  Users,
  Activity,
  X,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, token } = useAuth();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for enrolled students
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        if (user.role === 'Student') {
          const enrollmentData = await getMyEnrollments(token);
          setEnrollments(enrollmentData);
        }
        if (user.role === 'Instructor') {
          const courseData = await getMyCourses(token);
          
          // Fetch enrollment counts for each course
          const coursesWithCounts = await Promise.all(
            courseData.map(async (course) => {
              try {
                const students = await getEnrolledStudents(course._id, token);
                return { ...course, enrolledCount: students.length };
              } catch (error) {
                // If fetching fails, keep the original enrolledCount or default to 0
                console.log(error);
                return { ...course, enrolledCount: course.enrolledCount || 0 };
              }
            })
          );
          
          setMyCourses(coursesWithCounts);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, token]);

  const handleViewStudents = async (course: Course) => {
    setSelectedCourse(course);
    setShowStudentsModal(true);
    setLoadingStudents(true);
    
    try {
      const students = await getEnrolledStudents(course._id, token!);
      console.log('Enrolled students response:', students);
      setEnrolledStudents(students);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setEnrolledStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const closeModal = () => {
    setShowStudentsModal(false);
    setSelectedCourse(null);
    setEnrolledStudents([]);
  };

  // Get category-based gradient colors (matching CourseCard style)
  const getCategoryGradient = (category?: string) => {
    switch (category) {
      case 'Web':
        return 'from-blue-400 to-blue-600';
      case 'Design':
        return 'from-purple-400 to-purple-600';
      case 'Data':
        return 'from-sky-400 to-sky-600';
      case 'Marketing':
        return 'from-emerald-400 to-emerald-600';
      default:
        return 'from-indigo-400 to-indigo-600';
    }
  };

  const renderStudentDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700 font-medium text-base">Loading your courses</p>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 py-20">Error: {error}</p>;
    }
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

  const renderInstructorDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700 font-medium text-base">Loading dashboard</p>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 py-20">Error: {error}</p>;
    }
    return (
      <div className="space-y-12">
        {/* Analytics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Total Courses</h3>
                <p className="text-4xl font-extrabold mt-2">{myCourses.length}</p>
              </div>
              <BookOpen className="w-10 h-10 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white">
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

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Analytics</h3>
                <p className="text-4xl font-extrabold mt-2">📊</p>
              </div>
              <Activity className="w-10 h-10 opacity-80" />
            </div>
          </div>
        </section>

        {/* Premium Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/instructor/courses/create"
            className="relative flex items-center justify-center overflow-hidden py-4 rounded-xl font-semibold text-white shadow-lg transition-all group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 group-hover:opacity-90 transition duration-300"></div>
            <PlusCircle className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Create New Course</span>
          </Link>

          <Link
            to="/instructor/my-courses"
            className="relative flex items-center justify-center overflow-hidden py-4 rounded-xl font-semibold text-white shadow-lg transition-all group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-600 group-hover:opacity-90 transition duration-300"></div>
            <LayoutDashboard className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Manage My Courses</span>
          </Link>

          <button
            disabled
            className="relative flex items-center justify-center overflow-hidden py-4 rounded-xl font-semibold text-white shadow-md cursor-default opacity-80"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <Activity className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Analytics (Coming Soon)</span>
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
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  {/* Dynamic Image/Thumbnail */}
                  <div className="relative">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className={`w-full h-48 bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center`}>
                        <BookOpen className="w-20 h-20 text-white opacity-90" strokeWidth={1.5} />
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-xs font-semibold text-white py-1 px-2 rounded-full shadow-md
                      ${course.category === "Web"
                        ? "bg-blue-500"
                        : course.category === "Design"
                        ? "bg-purple-500"
                        : course.category === "Data"
                        ? "bg-sky-500"
                        : course.category === "Marketing"
                        ? "bg-emerald-500"
                        : "bg-indigo-500"
                      }`}
                    >
                      {course.category || 'General'}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                      {course.description || 'No description available.'}
                    </p>

                    <div className="mb-3 text-sm font-medium text-gray-600">
                      {course.enrolledCount || 0} Students Enrolled
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        to={`/instructor/courses/${course._id}/manage`}
                        className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-indigo-700 transition text-center"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => handleViewStudents(course)}
                        className="flex-1 bg-emerald-600 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1"
                      >
                        <Users className="w-4 h-4" />
                        Students
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-600">
              You haven't created any courses yet.
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
        {user?.role === 'Student' ? renderStudentDashboard() : renderInstructorDashboard()}
      </div>

      {/* Enrolled Students Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Enrolled Students - {selectedCourse?.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingStudents ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
                  </div>
                  <p className="mt-4 text-gray-600 text-sm">Loading students...</p>
                </div>
              ) : enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 text-sm uppercase font-semibold tracking-wide">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Enrolled On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((enrollment, idx) => (
                        <tr
                          key={enrollment._id || idx}
                          className={`border-b ${
                            idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          } hover:bg-blue-50 transition`}
                        >
                          <td className="p-4 text-gray-800 font-medium">
                            {enrollment.name || enrollment.studentId?.name || enrollment.student?.name || JSON.stringify(enrollment)}
                          </td>
                          <td className="p-4 text-gray-600">
                            {enrollment.email || enrollment.studentId?.email || enrollment.student?.email || 'N/A'}
                          </td>
                          <td className="p-4 text-gray-500">
                            {enrollment.enrolledAt || enrollment.createdAt 
                              ? new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 text-lg">
                  No students are currently enrolled in this course.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;