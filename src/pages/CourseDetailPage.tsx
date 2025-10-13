 // src/pages/CourseDetailPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  getCourseById,
  getLessonsByCourseId,
} from "../services/courseService";
import {
  enrollInCourse,
  markLessonAsComplete,
} from "../services/enrollmentService";
import { useAuth } from "../contexts/AuthContext";
import type { Course, Lesson } from "../types";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

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
        const courseData = await getCourseById(courseId, token);

        if (location.state?.isEnrolled) {
          courseData.enrollment = passedEnrollmentStatus;
        }

        const lessonsData = await getLessonsByCourseId(courseId, token);
        setCourse(courseData);
        setLessons(lessonsData);
        if (lessonsData.length > 0) setSelectedLesson(lessonsData[0]);
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
      setCourse((prev) =>
        prev ? { ...prev, enrollment: true } : null
      );
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
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === selectedLesson._id
            ? { ...lesson, isCompleted: true }
            : lesson
        )
      );
      setSelectedLesson((prev) =>
        prev ? { ...prev, isCompleted: true } : null
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsMarking(false);
    }
  };

  if (isLoading)
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer circle */}
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning circle */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          {/* Center pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Text with bouncing dots */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 font-medium text-base">Loading Course</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

if (error)
  return <p className="text-center text-red-500 py-10">Error: {error}</p>;

if (!course)
  return <p className="text-center py-10 text-gray-600">Course not found.</p>;


  const isInstructorOwner =
    user?.role === "Instructor" && user?._id === course.instructor._id;
  const isEnrolledStudent = user?.role === "Student" && course.enrollment;
  const canWatchVideo = isInstructorOwner || isEnrolledStudent;

  if (!course.isActive && !isInstructorOwner) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Course Unavailable
        </h1>
        <p className="text-lg text-gray-600">
          This course is no longer active and cannot be accessed.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
        >
          ← Back to All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          {course.title}
        </h1>
        {/* CHANGED: Added dangerouslySetInnerHTML to render HTML markup */}
        <div 
          className="text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black/60">
                        <LockClosedIcon className="w-16 h-16 text-white mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Content Locked
                        </h3>
                        <p className="text-gray-200 text-base max-w-md">
                          {isAuthenticated
                            ? "Enroll in this course to watch lessons."
                            : "Please log in and enroll to access this content."}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Lesson Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {selectedLesson.title}
                  </h2>
                  {/* CHANGED: Added dangerouslySetInnerHTML for lesson content too */}
                  <div 
                    className="text-gray-700 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                  />
                  {isEnrolledStudent && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={selectedLesson.isCompleted || isMarking}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedLesson.isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                      }`}
                    >
                      {isMarking
                        ? "Marking..."
                        : selectedLesson.isCompleted
                        ? "✓ Completed"
                        : "Mark as Complete"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="p-6 text-center text-gray-500">
                This course has no lessons yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
            {/* Enrollment Buttons */}
            {(() => {
              if (isInstructorOwner)
                return (
                  <Link
                    to={`/instructor/courses/${course._id}/students`}
                    className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                  >
                    View Enrolled Students
                  </Link>
                );

              if (!isAuthenticated)
                return (
                  <Link
                    to="/login"
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                  >
                    Login to Enroll
                  </Link>
                );

              if (course.enrollment)
                return (
                  <div className="p-3 bg-green-100 text-green-700 text-center rounded-md font-semibold">
                    You are enrolled
                  </div>
                );

              return (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:bg-gray-400"
                >
                  {isEnrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              );
            })()}
            {enrollmentError && (
              <p className="text-red-500 text-sm">{enrollmentError}</p>
            )}

            {/* Lessons List */}
            <h3 className="text-xl font-bold border-b pb-2 text-gray-800">
              Course Lessons
            </h3>
            <div className="max-h-[600px] overflow-y-auto pr-1 space-y-2">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                      selectedLesson?._id === lesson._id
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <PlayCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700 font-medium">
                        {lesson.title}
                      </span>
                    </div>
                    {isAuthenticated &&
                      (lesson.isCompleted ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-500"
                          title="Completed"
                        />
                      ) : (
                        <div
                          className="h-5 w-5 border-2 border-gray-300 rounded-full"
                          title="Not Completed"
                        ></div>
                      ))}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No lessons available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;