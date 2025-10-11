import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyEnrollments, type Enrollment } from '../services/enrollmentService';
import { getMyCourses } from '../services/courseService';
import type { Course } from '../types';
import ProgressCard from '../components/ProgressCard';

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
        if (user.role === 'Student') {
          const enrollmentData = await getMyEnrollments(token);
          setEnrollments(enrollmentData);
        }
        if (user.role === 'Instructor') {
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

  const renderStudentDashboard = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">Loading your courses...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Learning</h2>
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <ProgressCard key={enrollment._id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-600">You are not enrolled in any courses yet.</p>
            <Link to="/courses" className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    );
  };

  const renderInstructorDashboard = () => {
    if (isLoading) {
        return <p className="text-center text-gray-500">Loading dashboard...</p>;
    }
    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Total Courses Created</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{myCourses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Quick Actions</h3>
            <div className="mt-2 space-y-2">
                <Link to="/instructor/my-courses" className="block text-blue-500 font-medium hover:underline">
                  Manage All Courses &rarr;
                </Link>
                <Link to="/instructor/courses/create" className="block text-green-500 font-medium hover:underline">
                  Create a New Course &rarr;
                </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recently Created Courses</h2>
          {myCourses.length > 0 ? (
            <div className="space-y-3">

              {myCourses.slice(0, 3).map(course => (
                 <Link key={course._id} to={`/instructor/courses/${course._id}/manage`} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.category}</p>
                 </Link>
              ))}
            </div>
          ) : (
            <div className="text-center bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600">You have not created any courses yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.name}!</h1>
      {user?.role === 'Student' ? renderStudentDashboard() : renderInstructorDashboard()}
    </div>
  );
};

export default DashboardPage;