import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";
import Hero from "../components/Hero";


const HomePage = () => {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/courses");
                setCourses(response.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <Navbar />
                <main className="container">
                    <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>Loading courses...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <Navbar />
                <main className="container">
                    <p style={{ textAlign: 'center', color: 'red', fontSize: '1.5rem' }}>{error}</p>
                </main>
                <Footer />
            </div>
        );
    }

    const featuredCourses=courses.slice(0,3);

    return (

        <div className="page-container">

            <Navbar />
            <Hero />

            <main className="container">

                <h2 className="section-title">Featured Courses</h2>

                <div className="course-grid">
                    {featuredCourses.map((course) => (
                        <CourseCard
                            key={course._id}
                            title={course.title}
                            description={course.description}
                            category={course.category}
                        />
                    ))}
                </div>

            </main>

            <Footer />

        </div>

    );

};

export default HomePage;