// src/pages/EnrolledStudentsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnrolledStudents } from '../services/courseService';
import type { Student } from '../types';

const EnrolledStudentsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId && token) {
      const fetchStudents = async () => {
        try {
          setIsLoading(true);
          const data = await getEnrolledStudents(courseId, token);
          setStudents(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudents();
    }
  }, [courseId, token]);

  if (isLoading) return <p className="text-center">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enrolled Students</h1>
        <Link to={`/instructor/courses/${courseId}/manage`} className="text-blue-500 hover:underline">
          &larr; Back to Course Management
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {students.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{new Date(student.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No students are currently enrolled in this course.</p>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;