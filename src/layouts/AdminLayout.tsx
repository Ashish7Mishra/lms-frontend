// src/layouts/AdminLayout.tsx

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LayoutDashboard, Users, BookOpen, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const linkStyle = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700";
  const activeLinkStyle = "bg-blue-700";

  const mobileLinkStyle = "flex items-center gap-2 py-2 px-3 rounded transition duration-200 hover:bg-blue-700";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Top Header with Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-blue-600 text-white z-50 shadow-lg">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">LMS Admin</h1>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-blue-700 transition"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Collapsible Navigation */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-96' : 'max-h-0'}`}>
          <nav className="p-4 space-y-2">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `${mobileLinkStyle} ${isActive ? activeLinkStyle : ''}`}
              onClick={closeSidebar}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `${mobileLinkStyle} ${isActive ? activeLinkStyle : ''}`}
              onClick={closeSidebar}
            >
              <Users size={20} />
              <span>Users</span>
            </NavLink>
            <NavLink 
              to="/admin/courses" 
              className={({ isActive }) => `${mobileLinkStyle} ${isActive ? activeLinkStyle : ''}`}
              onClick={closeSidebar}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </NavLink>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-red-700 transition duration-200 text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 bg-blue-600 text-white p-4 flex-col h-screen sticky top-0">
        <h1 className="text-2xl font-bold mb-6">LMS Admin</h1>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/courses" 
                className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}
              >
                Courses
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-blue-700">
          <button 
            onClick={handleLogout} 
            className="w-full text-left py-2.5 px-4 rounded hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 overflow-auto mt-[73px] lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;