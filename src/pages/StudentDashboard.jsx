import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';



const StudentDashboard = () => {

    const { user } = useContext(AuthContext);

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const response = await axios.get("http://localhost:5000/api/enrollments", config);
                setEnrollments(response.data);


            }
            catch (err) {
                setError("could not fetch your enrolled courses ");
                console.error(err);
            }
            finally {
                setLoading(false)
            }
        };

        if (user?.token) {
            fetchEnrollments();
        }

    }, [user]);

    if (loading) {
        return (
            <div className="page-container">
                <Navbar />
                <main className="container"><p>Loading your courses...</p></main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <Navbar />
                <main className="container"><p style={{ color: 'red' }}>{error}</p></main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Navbar />
            <main className="container">
                <h1 className="page-title">Student Dashboard</h1>
                <p>Welcome, {user.name}! Here are the courses you are enrolled in.</p>

                {enrollments.length > 0 ? (
                    <div className="course-grid" style={{ marginTop: '40px' }}>
                        {enrollments.map((enrollment) => (
                            <CourseCard
                                key={enrollment._id}
                                id={enrollment.course._id}
                                title={enrollment.course.title}
                                description={enrollment.course.description}
                                category={enrollment.course.category}
                            />
                        ))}
                    </div>
                ) : (
                    <p style={{ marginTop: '20px' }}>You are not enrolled in any courses yet.</p>
                )}
            </main>
            <Footer />

        </div>
    );
};
export default StudentDashboard;