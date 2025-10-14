// src/pages/CourseDetailPage.tsx

import  type{ useState, useEffect } from "react";
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
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

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

  // Helper function to check if URL is YouTube or Vimeo
  const getEmbedUrl = (url: string, videoType?: string) => {
    if (videoType === 'link') {
      // YouTube
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      
      // Vimeo
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }
    
    // Return original URL for direct video files or uploaded videos
    return url;
  };

  const renderVideoPlayer = (lesson: Lesson) => {
    const embedUrl = getEmbedUrl(lesson.videoUrl, lesson.videoType);
    const isEmbedded = embedUrl !== lesson.videoUrl;

    if (isEmbedded) {
      // Render iframe for YouTube/Vimeo
      return (
        <iframe
          key={lesson._id}
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={lesson.title}
        />
      );
    } else {
      // Render video tag for direct links or uploaded videos
      return (
        <video
          key={lesson._id}
          className="w-full h-full"
          controls
          autoPlay
          src={lesson.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading course...</p>;
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
        <p className="text-gray-600">{course.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedLesson ? (
              <>
                <div className="aspect-video bg-black relative">
                  {canWatchVideo ? (
                    renderVideoPlayer(selectedLesson)
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
                  <div className="text-gray-700 mb-4 prose prose-sm max-w-none">
                    {selectedLesson.content.includes('<') && selectedLesson.content.includes('>') ? (
                      // Render as HTML if it contains HTML tags
                      <div
                        className="space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(selectedLesson.content, {
                            ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
                          })
                        }}
                      />
                    ) : (
                      // Render as Markdown if no HTML tags detected
                      <ReactMarkdown
                        components={{
                          h1: ({...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                          h2: ({...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                          h3: ({...props}) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
                          p: ({...props}) => <p className="mb-2" {...props} />,
                          ul: ({...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                          ol: ({...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                          li: ({...props}) => <li className="ml-2" {...props} />,
                          strong: ({...props}) => <strong className="font-bold" {...props} />,
                          em: ({...props}) => <em className="italic" {...props} />,
                          code: ({...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />,
                          pre: ({...props}) => <pre className="bg-gray-100 p-3 rounded mb-2 overflow-auto" {...props} />,
                          blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                          a: ({...props}) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
                        }}
                      >
                        {selectedLesson.content}
                      </ReactMarkdown>
                    )}
                  </div>
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