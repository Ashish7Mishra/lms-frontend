import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types'; // Make sure your Course type includes 'isActive'
 // Make sure your Course type includes 'isActive'

interface InstructorCourseCardProps {
  course: Course;
}

const InstructorCourseCard: React.FC<InstructorCourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative">
        <img
          src={course.imageUrl || 'https://via.placeholder.com/400x200'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {/* Status Badge to show if the course is active or inactive */}
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
        <p className="text-gray-500 text-sm mb-4">{course.category}</p>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* Link to the Edit Course page */}
          <Link
            to={`/instructor/courses/${course._id}/edit`}
            className="flex-1 text-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </Link>
          
          {/* --- THIS IS THE UPDATED PART --- */}
          {/* Link to the Manage Lessons page */}
          <Link
            to={`/instructor/courses/${course._id}/manage`}
            className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Manage Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseCard;