 import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Enrollment } from "../services/enrollmentService";

interface ProgressCardProps {
  enrollment: Enrollment;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ enrollment }) => {
  const targetProgress = enrollment.progress || 0;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate the progress bar
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(targetProgress), 150);
    return () => clearTimeout(timeout);
  }, [targetProgress]);

  // ✅ Pick the correct image field (handles all naming styles)
  const course = enrollment.course || {};
  const thumbnail =
    //course.thumbnail ||
    course.imageUrl ||
   // course.image ||
    "https://images.unsplash.com/photo-1522204502584-007f50f6e6f9?auto=format&fit=crop&w=800&q=60"; // fallback image

  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* ✅ Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={course.title || "Course Thumbnail"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1522204502584-007f50f6e6f9?auto=format&fit=crop&w=800&q=60";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent"></div>

        {course.category && (
          <span className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {course.category}
          </span>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
          {course.title || "Untitled Course"}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {course.description || "No description available."}
        </p>

        {/* Progress */}
        <div className="mt-auto mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-indigo-600">
              {animatedProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2.5 rounded-full transition-all duration-[1500ms] ease-out"
              style={{ width: `${animatedProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/courses/${course._id}`}
          className="inline-block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Continue Learning →
        </Link>
      </div>
    </div>
  );
};

export default ProgressCard;
