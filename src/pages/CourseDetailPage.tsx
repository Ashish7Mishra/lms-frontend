// src/pages/CourseDetailPage.tsx

import { useState, useEffect } from 'react';
// --- 1. Import useLocation ---
import { useParams, Link, useLocation } from 'react-router-dom';
import { getCourseById, getLessonsByCourseId } from '../services/courseService';
import { enrollInCourse, markLessonAsComplete } from '../services/enrollmentService';
import { useAuth } from '../contexts/AuthContext';
import type { Course, Lesson } from '../types';
import { CheckCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  // --- 2. Get the location object to access passed state ---
  const location = useLocation();

  // --- 3. Read the enrollment status passed from the previous page ---
  const passedEnrollmentStatus = location.state?.isEnrolled || false;

  const { token, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [courseDataFromApi, lessonsData] = await Promise.all([
          getCourseById(courseId, token),
          getLessonsByCourseId(courseId, token),
        ]);
        
        // --- 4. Manually add the passed enrollment status to the fetched course data ---
        courseDataFromApi.enrollment = passedEnrollmentStatus;

        setCourse(courseDataFromApi);
        setLessons(lessonsData);

        if (lessonsData.length > 0) {
          setSelectedLesson(lessonsData[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // --- 5. Add dependency to re-run if the passed state changes ---
  }, [courseId, token, passedEnrollmentStatus]);

  const handleEnroll = async () => {
    if (!token || !courseId) return;
    setIsEnrolling(true);
    setEnrollmentError(null);
    try {
      await enrollInCourse(courseId, token);
      setCourse(prevCourse => prevCourse ? { ...prevCourse, enrollment: true } : null);
    } catch (err: any) {
      setEnrollmentError(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!token || !selectedLesson) return;
    setIsMarking(true);
    try {
      await markLessonAsComplete(selectedLesson._id, token);
      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson._id === selectedLesson._id ? { ...lesson, isCompleted: true } : lesson
        )
      );
      setSelectedLesson(prev => prev ? { ...prev, isCompleted: true } : null);
    } catch (err: any) {
      console.error("Failed to mark complete:", err);
      alert(err.message);
    } finally {
      setIsMarking(false);
    }
  };

  const renderEnrollmentButton = () => {
    if (!isAuthenticated) {
      return (
        <Link to="/login" className="mt-4 w-full text-center block bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-600">
          Login to Enroll
        </Link>
      );
    }

    if (course?.enrollment) {
      return (
        <div className="mt-4 p-3 bg-green-100 text-green-800 text-center rounded-md font-semibold">
          You are enrolled in this course.
        </div>
      );
    }

    return (
      <button
        onClick={handleEnroll}
        disabled={isEnrolling}
        className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
      </button>
    );
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading course details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!course) return <p className="text-center text-gray-500">Course not found.</p>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
      </div>

      {/* Two-column layout for player and playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Video Player & Lesson Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {selectedLesson ? (
              <>
                <div className="aspect-video bg-black">
                  <video
                    key={selectedLesson._id}
                    className="w-full h-full"
                    controls
                    autoPlay
                    src={selectedLesson.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3">{selectedLesson.title}</h2>
                  <p className="text-gray-700 mb-4">{selectedLesson.content}</p>
                  
                  {course.enrollment && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={selectedLesson.isCompleted || isMarking}
                      className={`w-full font-semibold py-3 px-4 rounded-md transition-colors duration-200
                        disabled:bg-gray-300 disabled:cursor-not-allowed
                        ${selectedLesson.isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {isMarking 
                        ? 'Marking...' 
                        : selectedLesson.isCompleted 
                          ? '✓ Completed' 
                          : 'Mark as Complete'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Select a lesson to begin learning.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lesson Playlist */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            {renderEnrollmentButton()}
            {enrollmentError && <p className="text-red-500 text-sm mt-2">{enrollmentError}</p>}
            
            <h3 className="text-xl font-bold my-4 border-b pb-2">Course Lessons</h3>
            {lessons.length > 0 ? (
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson._id}>
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-3 rounded-md flex items-center justify-between transition-colors duration-200 ${
                        selectedLesson?._id === lesson._id
                          ? 'bg-blue-100 border-l-4 border-blue-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <PlayCircleIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      {isAuthenticated && (
                        lesson.isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" title="Completed"/>
                        ) : (
                          <div className="h-6 w-6 border-2 border-gray-300 rounded-full" title="Not Completed"></div>
                        )
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No lessons available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;