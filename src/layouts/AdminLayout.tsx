// src/layouts/AdminLayout.tsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();

  const linkStyle = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700";
  const activeLinkStyle = "bg-blue-700";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">LMS Admin</h1>
        <nav>
          <ul>
            <li><NavLink to="/admin/dashboard" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Dashboard</NavLink></li>
            <li><NavLink to="/admin/users" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Users</NavLink></li>
            <li><NavLink to="/admin/courses" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Courses</NavLink></li>
          </ul>
        </nav>
        <div className="absolute bottom-4">
            <button onClick={logout} className="w-full text-left py-2.5 px-4 rounded hover:bg-red-700">Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;