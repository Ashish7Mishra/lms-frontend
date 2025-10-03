// src/pages/CourseDetailPage.jsx

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CourseDetailPage = () => {
  // Get user from context to check login status, role, and get the token
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get the dynamic 'courseId' from the URL
  const { courseId } = useParams();

  // State for the page's data and UI status
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // useEffect to fetch all necessary data when the component loads or courseId changes
  useEffect(() => {
    const fetchCourseData = async () => {
      // Reset state for new data fetch
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the main course details from the public endpoint
        const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(courseRes.data);

        // Fetch the lessons for this course from the public endpoint
        const lessonsRes = await axios.get(`http://localhost:5000/api/courses/${courseId}/lessons`);
        setLessons(lessonsRes.data);

      } catch (err) {
        setError('Could not load course details. It may not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]); // Dependency array ensures this re-runs if the user navigates to a new course detail page

  // Handler for the enroll button click
  const handleEnroll = async () => {
    // This is a safeguard, but the button shouldn't even be visible if !user
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsEnrolling(true);
    try {
      // Configuration with the authorization token for the protected endpoint
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // API call to the backend to create an enrollment
      await axios.post('http://localhost:5000/api/enrollments', { courseId }, config);

      // On successful enrollment, redirect the student to their dashboard
      alert('Successfully enrolled!');
      navigate('/student/dashboard');

    } catch (err) {
      // Display a user-friendly error from the backend (e.g., "Already enrolled")
      alert(err.response?.data?.message || 'Enrollment failed. Please try again.');
      setIsEnrolling(false);
    }
  };

  // --- Conditional Rendering for Loading and Error States ---

  if (loading) {
    return (
        <div className="page-container">
            <Navbar />
            <main className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                <p style={{fontSize: '1.5rem'}}>Loading Course...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (error) {
    return (
        <div className="page-container">
            <Navbar />
            <main className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                <p style={{ color: 'red', fontSize: '1.5rem' }}>{error}</p>
            </main>
            <Footer />
        </div>
    );
  }

  // --- Main Render Logic ---

  return (
    <div className="page-container">
      <Navbar />
      <main className="container" style={{ paddingTop: '40px' }}>
        {course && (
          <>
            <h1 className="page-title">{course.title}</h1>
            <p style={{ fontStyle: 'italic', color: '#555' }}>
              Taught by: {course.instructor.name}
            </p>
            <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>{course.description}</p>
            
            {/* Conditional Enroll Button Logic */}
            
            {/* 1. Show enroll button ONLY for logged-in Students */}
            {user && user.role === 'Student' && (
              <button
                onClick={handleEnroll}
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
                disabled={isEnrolling}
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll in this Course'}
              </button>
            )}

            {/* 2. Show a "Login to Enroll" link for logged-out users */}
            {!user && (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ marginTop: '20px', display: 'inline-block' }}
              >
                Login to Enroll
              </Link>
            )}

            {/* Instructors see nothing here, as they cannot enroll */}

            <div className="lessons-list" style={{ marginTop: '40px' }}>
              <h2>Lessons</h2>
              {lessons.length > 0 ? (
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {lessons.map((lesson, index) => (
                    <li key={lesson._id} style={{ background: '#f9f9f9', marginBottom: '10px', padding: '15px', borderRadius: '5px' }}>
                      <strong>Lesson {index + 1}:</strong> {lesson.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No lessons have been added to this course yet.</p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;