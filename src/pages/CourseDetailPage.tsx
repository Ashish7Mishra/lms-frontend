 // src/pages/CourseDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getCourseById, getLessonsByCourseId } from '../services/courseService';
import { enrollInCourse, markLessonAsComplete } from '../services/enrollmentService';
import { useAuth } from '../contexts/AuthContext';
import type { Course, Lesson } from '../types';
import { CheckCircleIcon, PlayCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const passedEnrollmentStatus = location.state?.isEnrolled || false;

  const { user, isAuthenticated, token } = useAuth();

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
        const courseDataFromApi = await getCourseById(courseId, token);

        if (location.state?.isEnrolled) {
          courseDataFromApi.enrollment = passedEnrollmentStatus;
        }

        const lessonsData = await getLessonsByCourseId(courseId, token);
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
  }, [courseId, token, passedEnrollmentStatus, location.state]);

  const handleEnroll = async () => {
    if (!token || !courseId) return;
    setIsEnrolling(true);
    setEnrollmentError(null);
    try {
      await enrollInCourse(courseId, token);
      setCourse(prev => (prev ? { ...prev, enrollment: true } : null));
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
      setLessons(prev =>
        prev.map(lesson =>
          lesson._id === selectedLesson._id ? { ...lesson, isCompleted: true } : lesson
        )
      );
      setSelectedLesson(prev => (prev ? { ...prev, isCompleted: true } : null));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsMarking(false);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading course...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!course) return <p className="text-center py-10">Course not found.</p>;

  const isInstructorOwner = user?.role === 'Instructor' && user?._id === course.instructor._id;
  const isEnrolledStudent = user?.role === 'Student' && course.enrollment;
  const canWatchVideo = isInstructorOwner || isEnrolledStudent;

  if (!course.isActive && !isInstructorOwner) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Course Unavailable</h1>
        <p className="text-lg text-gray-600 mb-6">This course is no longer active.</p>
        <Link
          to="/courses"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
        >
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Course Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-3 max-w-3xl mx-auto">{course.description}</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Section */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl overflow-hidden">
          {selectedLesson ? (
            <>
              <div className="aspect-video bg-black relative">
                {canWatchVideo ? (
                  <video
                    key={selectedLesson._id}
                    className="w-full h-full"
                    controls
                    autoPlay
                    src={selectedLesson.videoUrl}
                  />
                ) : (
                  <>
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-25"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                      <LockClosedIcon className="w-16 h-16 mb-4" />
                      <h3 className="text-2xl font-semibold mb-2">Content Locked</h3>
                      <p className="max-w-sm text-center text-gray-200">
                        {isAuthenticated
                          ? 'Enroll in this course to watch lessons.'
                          : 'Please log in to access the content.'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">{selectedLesson.content}</p>

                {isEnrolledStudent && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={selectedLesson.isCompleted || isMarking}
                    className={`w-full py-3 font-semibold rounded-lg transition-all ${
                      selectedLesson.isCompleted
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
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
            <p className="p-6 text-center text-gray-500">No lessons available yet.</p>
          )}
        </div>

        {/* Sidebar Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          {/* Enrollment Section */}
          <div className="mb-6">
            {isInstructorOwner ? (
              <Link
                to={`/instructor/courses/${course?._id}/students`}
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
              >
                View Enrolled Students
              </Link>
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
              >
                Login to Enroll
              </Link>
            ) : course.enrollment ? (
              <div className="bg-green-100 text-green-800 text-center py-3 rounded-md font-semibold">
                You are enrolled
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:bg-gray-300 transition"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
            {enrollmentError && (
              <p className="text-red-500 text-sm mt-2 text-center">{enrollmentError}</p>
            )}
          </div>

          {/* Lessons List */}
          <h3 className="text-xl font-bold mb-3 border-b pb-2">Course Lessons</h3>
          <div className="max-h-[500px] overflow-y-auto pr-1">
            {lessons.length > 0 ? (
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson._id}>
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                        selectedLesson?._id === lesson._id
                          ? 'bg-blue-100 border-l-4 border-blue-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <PlayCircleIcon className="h-6 w-6 text-gray-400" />
                        <span className="font-medium text-gray-800">{lesson.title}</span>
                      </div>
                      {isAuthenticated &&
                        (lesson.isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <div
                            className="h-6 w-6 border-2 border-gray-300 rounded-full"
                            title="Not Completed"
                          ></div>
                        ))}
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
