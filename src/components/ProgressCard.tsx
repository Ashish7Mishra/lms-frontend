// src/components/ProgressCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import type { Enrollment } from '../services/enrollmentService'; 

interface ProgressCardProps {
  enrollment: Enrollment;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ enrollment }) => {
  const { course, progress } = enrollment;
  const isInactive = !course.isActive;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity ${isInactive ? 'opacity-60 grayscale' : ''}`}>
      <div className="relative">
        <img
          src={course.imageUrl || 'https://via.placeholder.com/400x200'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {/* If inactive, show a badge */}
        {isInactive && (
          <span className="absolute top-2 right-2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-red-500">
            Inactive
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 h-14 overflow-hidden">{course.title}</h3>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

       <Link
          to={isInactive ? '#' : `/courses/${course._id}`} // Link to nowhere if inactive
          state={{ isEnrolled: true }}
          // Prevent clicking and change style if inactive
          className={`w-full text-center block font-bold py-2 px-4 rounded ${
            isInactive
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={(e) => { if (isInactive) e.preventDefault(); }} // Extra safety to prevent navigation
        >
          {isInactive ? 'Course is Inactive' : 'Continue Learning'}
        </Link>
      </div>
    </div>
  );
};

export default ProgressCard;