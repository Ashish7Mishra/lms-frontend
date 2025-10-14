 // src/pages/EnrolledStudentsPage.tsx
import type, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnrolledStudents } from "../services/courseService";
import { SpinnerIcon } from "../components/Spinner";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-20">
          <SpinnerIcon className="w-12 h-12 text-blue-600" />
          <p className="mt-4 text-gray-600 text-sm">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <p className="text-center text-red-500 py-20 text-lg">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">
            Enrolled{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Students
            </span>
          </h1>
          <Link
            to={`/instructor/courses/${courseId}/manage`}
            className="text-sm font-semibold text-blue-600 hover:text-indigo-600 transition"
          >
            ← Back to Course Management
          </Link>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 text-sm uppercase font-semibold tracking-wide">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Enrolled On</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr
                      key={student._id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="p-4 text-gray-800 font-medium">
                        {student.name}
                      </td>
                      <td className="p-4 text-gray-600">{student.email}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg">
              No students are currently enrolled in this course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;