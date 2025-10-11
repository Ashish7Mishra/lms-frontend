// src/components/CourseCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types'; 

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img
        src={course.imageUrl || 'https://via.placeholder.com/400x200'}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-500 text-sm mb-2">By {course.instructor.name}</p>
        <p className="text-gray-700 text-sm mb-4 h-10 overflow-hidden">{course.description}</p>
         <Link
          to={`/courses/${course._id}`}
          // We pass the enrollment status in the 'state' object
          state={{ isEnrolled: course.enrollment }} 
          className="w-full text-center block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          {course.enrollment ? "Go to Course" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;