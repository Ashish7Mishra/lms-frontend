 // src/components/CourseCard.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionLength = 100;
  const isLongDescription = course.description.length > maxDescriptionLength;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-sm mx-auto border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative">
        <img
          src={course.imageUrl || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />

        {/* Category Tag */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold text-white py-1.5 px-3 rounded-full shadow-md
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

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {course.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4">
          By <span className="font-medium text-gray-700">{course.instructor.name}</span>
        </p>

        {/* Description with View More */}
        <div className="text-gray-600 text-sm mb-4 flex-grow">
          <p>
            {showFullDescription || !isLongDescription
              ? course.description
              : `${course.description.substring(0, maxDescriptionLength)}...`}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-indigo-600 hover:text-indigo-700 font-medium mt-1 text-sm"
            >
              {showFullDescription ? "View Less" : "View More"}
            </button>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/courses/${course._id}`}
          state={{ isEnrolled: course.enrollment }}
          className={`block text-center w-full text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 mt-auto ${
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