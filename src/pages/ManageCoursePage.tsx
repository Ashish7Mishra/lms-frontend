// src/pages/ManageCoursePage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCourseById } from '../services/courseService';
import { getLessonsByCourseId } from '../services/courseService';
import { createLesson, updateLesson, deleteLesson } from '../services/lessonService';
import type { Course, Lesson } from '../types';
import Modal from '../components/Modal';
import LessonForm from '../components/LessonForm';

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
      if (editingLesson) { // UPDATE
        const updatedLesson = await updateLesson(editingLesson._id, formData, token);
        setLessons(lessons.map(l => l._id === updatedLesson._id ? updatedLesson : l));
      } else { // CREATE
        const newLesson = await createLesson(courseId, formData, token);
        setLessons([...lessons, newLesson]);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await deleteLesson(lessonId, token);
      setLessons(lessons.filter(l => l._id !== lessonId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) return <p>Loading course content...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Manage: {course?.title}</h1>
        <div className="flex items-center space-x-2">
          <Link
            to={`/courses/${course?._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600"
          >
            Preview Course
          </Link>
          <button onClick={openAddModal} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
            + Add Lesson
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Lessons</h2>
        <ul className="space-y-3">
          {lessons.sort((a, b) => a.order - b.order).map(lesson => (
            <li key={lesson._id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <span className="font-bold">{lesson.order}. {lesson.title}</span>
              </div>
              <div className="space-x-2">
                <button onClick={() => openEditModal(lesson)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDeleteLesson(lesson._id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
        {lessons.length === 0 && <p>No lessons yet. Click "Add Lesson" to get started.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingLesson ? 'Edit Lesson' : 'Add New Lesson'}>
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