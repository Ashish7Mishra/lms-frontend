 // src/components/CourseCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const maxDescriptionHeightCollapsed = 72; // px
  const maxDescriptionHeightExpanded = 48; // px

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-[240px] flex flex-col h-[320px] border border-gray-100">
      
      {/* Image */}
      <div className="relative">
        <img
          src={course.imageUrl || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-42 object-cover" // Increased from h-24 to h-36
        />
        <span
          className={`absolute top-2 left-2 text-xs font-semibold text-white py-1 px-2 rounded-full shadow-md
            ${course.category === "Web"
              ? "bg-blue-500"
              : course.category === "Design"
              ? "bg-purple-500"
              : course.category === "Data"
              ? "bg-sky-500"
              : course.category === "Marketing"
              ? "bg-emerald-500"
              : "bg-indigo-500"
            }`}
        >
          {course.category || "General"}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow relative">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
          {course.title}
        </h3>
        <p className="text-gray-500 text-xs mb-1 truncate">
          By <span className="font-medium text-gray-700">{course.instructor.name}</span>
        </p>

        {/* Description */}
        <div className="text-gray-600 text-xs mb-2 flex-grow relative">
          <div
            className={`overflow-auto pr-1 transition-all duration-300`}
            style={{
              maxHeight: showFullDescription
                ? maxDescriptionHeightExpanded
                : maxDescriptionHeightCollapsed,
            }}
          >
            <p>{course.description}</p>
          </div>
          {course.description.length > 60 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="absolute bottom-0 right-0 text-indigo-600 hover:text-indigo-700 font-medium text-xs bg-white px-1"
            >
              {showFullDescription ? "View Less" : "View More"}
            </button>
          )}
        </div>

        {/* Fixed Bottom Button */}
        <Link
          to={`/courses/${course._id}`}
          state={{ isEnrolled: course.enrollment }}
          className={`block text-center w-full text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-300 mt-auto ${
            course.enrollment
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          }`}
        >
          {course.enrollment ? "Go to Course" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
