  // src/pages/ManageCoursePage.tsx

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getCourseById,
  getLessonsByCourseId,
} from "../services/courseService";
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "../services/lessonService";
import type { Course, Lesson } from "../types";
import Modal from "../components/Modal";
import LessonForm from "../components/LessonForm";

const ManageCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!courseId || !token) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(courseId, token),
          getLessonsByCourseId(courseId, token),
        ]);
        setCourse(courseData);
        setLessons(lessonsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, token]);

  const openAddModal = () => {
    setEditingLesson(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!token || !courseId) return;
    setIsSubmitting(true);
    try {
      if (editingLesson) {
        const updatedLesson = await updateLesson(
          editingLesson._id,
          formData,
          token
        );
        setLessons((prev) =>
          prev.map((l) => (l._id === updatedLesson._id ? updatedLesson : l))
        );
      } else {
        const newLesson = await createLesson(courseId, formData, token);
        setLessons((prev) => [...prev, newLesson]);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (
      !token ||
      !window.confirm("Are you sure you want to delete this lesson?")
    )
      return;
    try {
      await deleteLesson(lessonId, token);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err: any) {
      alert(err.message);
    }
  };

 if (isLoading)
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 font-medium text-base"> Loading course content...</p>
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
    return (
      <p className="text-center text-red-500 py-20 text-lg">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Manage:{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {course?.title}
            </span>
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to={`/courses/${course?._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition"
            >
              Preview Course
            </Link>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition"
            >
              + Add Lesson
            </button>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lessons</h2>

          {lessons.length > 0 ? (
            <ul className="space-y-3">
              {lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <li
                    key={lesson._id}
                    className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold">
                        {lesson.order}.
                      </span>
                      <span className="font-medium text-gray-800">
                        {lesson.title}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="text-red-500 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No lessons yet. Click{" "}
              <span className="text-blue-600 font-semibold">“Add Lesson”</span>{" "}
              to get started.
            </p>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingLesson ? "Edit Lesson" : "Add New Lesson"}
        >
          <LessonForm
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            isLoading={isSubmitting}
            initialData={editingLesson}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ManageCoursePage;