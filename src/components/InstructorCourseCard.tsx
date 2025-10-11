// src/components/InstructorCourseCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types';

interface InstructorCourseCardProps {
  course: Course;
  // Prop is now more specific
  onDeactivate: (courseId: string) => void;
}

const InstructorCourseCard: React.FC<InstructorCourseCardProps> = ({ course, onDeactivate }) => {
  // Style for disabled links
  const disabledLinkStyle = "pointer-events-none grayscale opacity-50";

  return (
    // If the course is inactive, make the entire card less visible
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity ${!course.isActive ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img
          src={course.imageUrl || 'https://via.placeholder.com/400x200'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white ${
            course.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {course.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 h-14 overflow-hidden">{course.title}</h3>
        
        <div className="flex flex-col space-y-2">
          {/* Top row for primary actions */}
          <div className="flex space-x-2">
            <Link
              to={`/instructor/courses/${course._id}/edit`}
              className={`flex-1 text-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 ${!course.isActive && disabledLinkStyle}`}
            >
              Edit Details
            </Link>
            <Link
              to={`/instructor/courses/${course._id}/manage`}
              className={`flex-1 text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 ${!course.isActive && disabledLinkStyle}`}
            >
              Manage Lessons
            </Link>
          </div>
          
          {/* Preview as Student Link */}
          <Link
            to={`/courses/${course._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600 ${!course.isActive && disabledLinkStyle}`}
          >
            Preview as Student
          </Link>
          
          {/* --- THIS IS THE NEW LOGIC --- */}
          {/* Only show the button if the course is active. */}
          {course.isActive ? (
            <button
              onClick={() => onDeactivate(course._id)}
              className="w-full text-center bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
            >
              Deactivate Course
            </button>
          ) : (
            // If inactive, show a disabled message instead of a button.
            <div className="w-full text-center bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed">
              Deactivated
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseCard;