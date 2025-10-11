 import React from "react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface InstructorCourseCardProps {
  course: Course;
  onDeactivate: (courseId: string) => void;
}

const InstructorCourseCard: React.FC<InstructorCourseCardProps> = ({
  course,
  onDeactivate,
}) => {
  const disabledLinkStyle =
    "pointer-events-none grayscale opacity-50 cursor-not-allowed";

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
        !course.isActive ? "opacity-60" : ""
      }`}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={course.imageUrl || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Status Tag */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold py-1.5 px-3 rounded-full shadow-md text-white ${
            course.isActive
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          }`}
        >
          {course.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col h-full">
        {/* Course Title */}
        <h3
          className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug mb-1"
          title={course.title}
        >
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-500 mb-4">
          Instructor:{" "}
          <span className="font-medium text-gray-700">
            {course.instructor?.name || "Unknown"}
          </span>
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col space-y-2 mt-auto">
          {/* Edit + Manage Row */}
          <div className="flex space-x-2">
            <Link
              to={`/instructor/courses/${course._id}/edit`}
              className={`flex-1 text-center py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !course.isActive
                  ? disabledLinkStyle
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md"
              }`}
            >
              Edit Details
            </Link>
            <Link
              to={`/instructor/courses/${course._id}/manage`}
              className={`flex-1 text-center py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !course.isActive
                  ? disabledLinkStyle
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              Manage Lessons
            </Link>
          </div>

          {/* Preview as Student */}
          <Link
            to={`/courses/${course._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-center py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
              !course.isActive
                ? disabledLinkStyle
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-sm hover:shadow-md"
            }`}
          >
            Preview as Student
          </Link>

          {/* Deactivate / Deactivated */}
          {course.isActive ? (
            <button
              onClick={() => onDeactivate(course._id)}
              className="w-full text-center py-2.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Deactivate Course
            </button>
          ) : (
            <div className="w-full text-center py-2.5 px-4 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed">
              Deactivated
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseCard;
