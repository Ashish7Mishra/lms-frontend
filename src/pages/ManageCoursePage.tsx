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

  // Modal and Form State
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
        setLessons((lessons) =>
          lessons.map((l) =>
            l._id === updatedLesson._id ? updatedLesson : l
          )
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
      setLessons((lessons) => lessons.filter((l) => l._id !== lessonId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading course content...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-10">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">
            Manage{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
              {course?.title || "Course"}
            </span>
          </h1>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/courses/${course?._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition-all"
            >
              Preview Course
            </Link>

            <button
              onClick={openAddModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition-all"
            >
              + Add Lesson
            </button>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Course Lessons
          </h2>

          {lessons.length > 0 ? (
            <ul className="space-y-4">
              {lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <li
                    key={lesson._id}
                    className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {lesson.order}. {lesson.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {lesson.description || "No description available."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="text-red-500 font-medium hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">
                No lessons yet. Click{" "}
                <span className="font-semibold text-green-600">
                  “Add Lesson”
                </span>{" "}
                to get started.
              </p>
              <button
                onClick={openAddModal}
                className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition-all"
              >
                Add First Lesson
              </button>
            </div>
          )}
        </div>
      </div>

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
  );
};

export default ManageCoursePage;
