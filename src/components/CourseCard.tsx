 import React from "react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-sm mx-auto border border-gray-100">
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
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4">{course.instructor?.name}</p>

        {/* Gradient Button */}
        <Link
          to={`/courses/${course._id}`}
          state={{ isEnrolled: course.enrollment }}
          className="block text-center w-full text-white font-semibold py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-md"
        >
          {course.enrollment ? "Go to Course" : "View Course"}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
