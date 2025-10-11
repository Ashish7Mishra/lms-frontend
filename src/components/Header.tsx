// src/components/Header.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const Header = () => {

    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    LMS
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/courses" className="text-gray-600 hover:text-blue-500">
                        Courses
                    </Link>

                    {isAuthenticated ? (

<>
                            <span className="text-gray-700">Hello, {user?.name}</span>
                            <Link to="/dashboard" className="text-gray-600 hover:text-blue-500">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // --- Guest User Links ---
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-500">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};


export default Header;