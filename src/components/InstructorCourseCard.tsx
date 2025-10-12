 // src/components/InstructorCourseCard.tsx

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
  const disabledLinkStyle = "pointer-events-none grayscale opacity-50";

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-xl flex flex-col h-full ${
        !course.isActive ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={course.imageUrl || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-3 right-3 text-xs font-semibold py-1 px-3 uppercase rounded-full text-white shadow-md ${
            course.isActive
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : "bg-gradient-to-r from-red-400 to-red-600"
          }`}
        >
          {course.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {course.title}
        </h3>

        {/* Buttons Section */}
        <div className="flex flex-col space-y-2 mt-auto">
          <div className="flex gap-2">
            {/* Edit Button */}
            <Link
              to={`/instructor/courses/${course._id}/edit`}
              className={`flex-1 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all ${
                !course.isActive && disabledLinkStyle
              }`}
            >
              Edit Details
            </Link>

            {/* Manage Button */}
            <Link
              to={`/instructor/courses/${course._id}/manage`}
              className={`flex-1 text-center bg-gray-100 text-gray-800 font-medium py-2 rounded-lg border hover:bg-gray-200 transition ${
                !course.isActive && disabledLinkStyle
              }`}
            >
              Manage Lessons
            </Link>
          </div>

          {/* Preview Button */}
          <Link
            to={`/courses/${course._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 rounded-lg shadow-md hover:opacity-90 transition ${
              !course.isActive && disabledLinkStyle
            }`}
          >
            Preview as Student
          </Link>

          {/* Active / Inactive Button */}
          {course.isActive ? (
            <button
              onClick={() => onDeactivate(course._id)}
              className="w-full text-center bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition"
            >
              Deactivate Course
            </button>
          ) : (
            <div className="w-full text-center bg-gray-300 text-gray-500 font-semibold py-2 rounded-lg cursor-not-allowed">
              Deactivated
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseCard;
