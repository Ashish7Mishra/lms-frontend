// src/components/ProgressCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import type { Enrollment } from '../services/enrollmentService'; // Import the new type
 // Import the new type

interface ProgressCardProps {
  enrollment: Enrollment;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ enrollment }) => {
  const { course, progress } = enrollment;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={course.imageUrl || 'https://via.placeholder.com/400x200'}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
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
          to={`/courses/${course._id}`}
          state={{ isEnrolled: true }} // Pass enrollment state to detail page
          className="w-full text-center block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
};

export default ProgressCard;