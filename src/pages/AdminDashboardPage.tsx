// src/pages/admin/AdminDashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData, type DashboardData } from '../services/adminService';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';

// A simple reusable card component for stats with icons
const StatCard = ({ 
  title, 
  value, 
  icon: Icon,
  colorClass = 'text-blue-600'
}: { 
  title: string; 
  value: number; 
  icon: any;
  colorClass?: string;
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">{title}</h3>
        <p className={`text-2xl sm:text-4xl font-bold ${colorClass} mt-1 sm:mt-2`}>{value}</p>
      </div>
      <div className={`${colorClass} opacity-20`}>
        <Icon size={48} className="hidden sm:block" />
        <Icon size={32} className="block sm:hidden" />
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const data = await getDashboardData(token);
          setDashboardData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <p className="text-red-600 text-center">Error: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
        <p className="text-yellow-700 text-center">No data available.</p>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Overview of your learning management system</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users}
          colorClass="text-blue-600"
        />
        <StatCard 
          title="Total Instructors" 
          value={stats.totalInstructors} 
          icon={GraduationCap}
          colorClass="text-green-600"
        />
        <StatCard 
          title="Total Courses" 
          value={stats.totalCourses} 
          icon={BookOpen}
          colorClass="text-purple-600"
        />
        <StatCard 
          title="Total Enrollments" 
          value={stats.totalEnrollments} 
          icon={UserCheck}
          colorClass="text-orange-600"
        />
      </div>

      {/* Additional Info Section */}
      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2">
            <p className="text-xs sm:text-sm text-gray-600">Average Enrollments per Course</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {stats.totalCourses > 0 
                ? (stats.totalEnrollments / stats.totalCourses).toFixed(1) 
                : '0'}
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2">
            <p className="text-xs sm:text-sm text-gray-600">Student to Instructor Ratio</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {stats.totalInstructors > 0 
                ? (stats.totalStudents / stats.totalInstructors).toFixed(1) 
                : '0'}:1
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-3 sm:pl-4 py-2">
            <p className="text-xs sm:text-sm text-gray-600">Courses per Instructor</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {stats.totalInstructors > 0 
                ? (stats.totalCourses / stats.totalInstructors).toFixed(1) 
                : '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;