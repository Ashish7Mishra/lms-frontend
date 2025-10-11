 import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnrolledStudents } from "../services/courseService";
import type { Student } from "../types";

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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading students...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-10">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-100 p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">
            Enrolled{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
              Students
            </span>
          </h1>

          <Link
            to={`/instructor/courses/${courseId}/manage`}
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-all"
          >
            ← Back to Course Management
          </Link>
        </div>

        {/* Table Section */}
        {students.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Enrolled On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {students.map((student, index) => (
                  <tr
                    key={student._id}
                    className={`hover:bg-indigo-50 transition-all ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center bg-gray-50 border border-gray-200 p-10 rounded-lg">
            <p className="text-gray-600 mb-4">
              No students are currently enrolled in this course.
            </p>
            <Link
              to="/instructor/my-courses"
              className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Go to My Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;
