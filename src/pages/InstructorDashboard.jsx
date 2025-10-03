import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';

const InstructorDashboard = () => {

    const { user } = useContext(AuthContext);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchCreatedCourses = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const response = await axios.get('http://localhost:5000/api/courses/my-creations', config);
                setCourses(response.data);
            }

            catch (err) {
                setError('Could not fetch the courses you created.');
                console.error(err);
            }
            finally {
                setLoading(false)
            }
        };

        if (user?.token) {
            fetchCreatedCourses();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="page-container">
                <Navbar />
                <main className="container"><p>Loading your dashboard...</p></main>
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
                <div className="dashboard-header">
                    <h1 className="page-title">Instructor Dashboard</h1>
         
                    <Link to="/instructor/create-course" className="btn btn-primary">
                        Create New Course
                    </Link>
                </div>
                <p>Welcome, {user.name}! Here are the courses you have created.</p>


                {courses.length > 0 ? (
                    <div className="course-grid" style={{ marginTop: '40px' }}>
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                id={course._id}
                                title={course.title}
                                description={course.description}
                                category={course.category}
                            />
                        ))}
                    </div>
                ) : (
                    <p style={{ marginTop: '20px' }}>You have not created any courses yet.</p>
                )}
            </main>
            <Footer />
        </div>
    );
};
export default InstructorDashboard;