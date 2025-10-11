// src/pages/DashboardPage.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyEnrollments, type Enrollment } from '../services/enrollmentService';
import ProgressCard from '../components/ProgressCard';

const DashboardPage = () => {
    const { user, token } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch enrollments if the user is a Student and we have a token
        if (user?.role === 'Student' && token) {
            const fetchEnrollments = async () => {
                try {
                    setIsLoading(true);
                    const data = await getMyEnrollments(token);
                    setEnrollments(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEnrollments();
        } else {
            // If user is an instructor or not logged in, no need to load
            setIsLoading(false);
        }
    }, [user, token]); // Effect runs when user or token changes

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
                    </div>
                )}
            </div>
        );
    };

    const renderInstructorDashboard = () => {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Instructor Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/instructor/my-courses" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold text-blue-600">Manage My Courses</h3>
                        <p className="mt-2 text-gray-600">View, create, and edit your courses.</p>
                    </Link>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-400">View Analytics (Coming Soon)</h3>
                        <p className="mt-2 text-gray-500">Track student engagement and performance.</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
            {user?.role === 'Student' ? renderStudentDashboard() : renderInstructorDashboard()}
        </div>
    );
};

export default DashboardPage;