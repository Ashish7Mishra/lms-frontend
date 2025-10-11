  import { useState, useRef, useEffect } from "react";
 import { Link, useLocation } from "react-router-dom";
 import { Menu, X, ChevronDown } from "lucide-react";
 import { useAuth } from "../contexts/AuthContext";
 
 const Navbar = () => {
   const [menuOpen, setMenuOpen] = useState(false);
   const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const location = useLocation();
   const { user, logout } = useAuth();
   const avatarRef = useRef<HTMLDivElement | null>(null);
 
   const baseLinks = [
     { name: "Home", path: "/" },
     { name: "Courses", path: "/courses" },
   ];
 
   const guestLinks = [
     { name: "Login", path: "/login" },
     { name: "Register", path: "/register" },
   ];
 
   // Close avatar dropdown on outside click
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
         setAvatarMenuOpen(false);
       }
     };
     document.addEventListener("mousedown", handleClickOutside);
     return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);
 
   const handleLogout = () => {
     setShowLogoutModal(false);
     logout();
   };
 
   return (
     <>
       <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
         <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
           {/* Logo */}
           <Link to="/" className="flex items-center space-x-2">
             <img
               src="src/assets/logo.jpg"
               alt="LMS Logo"
               className="h-10 w-auto object-contain"
             />
             <span className="text-lg font-bold text-indigo-600">LMS</span>
           </Link>
 
           {/* Desktop Menu */}
           <ul className="hidden md:flex items-center gap-4 lg:gap-6">
             {[...baseLinks, ...(user ? [] : guestLinks)].map((link) => {
               const isActive = location.pathname === link.path;
               return (
                 <li key={link.name}>
                   <Link
                     to={link.path}
                     className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                       isActive
                         ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                         : "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-md"
                     }`}
                   >
                     {link.name}
                   </Link>
                 </li>
               );
             })}
 
             {/* Avatar Menu */}
             {user && (
                <li className="relative" ref={avatarRef}>(null);
                 <button
                   onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                   className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full hover:from-blue-200 hover:to-purple-200 transition-all"
                 >
                   <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                     {user.name?.charAt(0).toUpperCase() || "U"}
                   </div>
                   <ChevronDown
                     className={`w-4 h-4 text-gray-700 transition-transform ${
                       avatarMenuOpen ? "rotate-180" : ""
                     }`}
                   />
                 </button>
 
                 {avatarMenuOpen && (
                   <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fadeIn">
                     <p className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 font-medium">
                       {user.name}
                     </p>
                     <Link
                       to="/dashboard"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       onClick={() => setAvatarMenuOpen(false)}
                     >
                       Dashboard
                     </Link>
                     <button
                       onClick={() => {
                         setAvatarMenuOpen(false);
                         setShowLogoutModal(true);
                       }}
                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                     >
                       Logout
                     </button>
                   </div>
                 )}
               </li>
             )}
           </ul>
 
           {/* Mobile Menu Button */}
           <button
             className="md:hidden p-2 text-gray-700 focus:outline-none"
             onClick={() => setMenuOpen(!menuOpen)}
           >
             {menuOpen ? <X size={26} /> : <Menu size={26} />}
           </button>
         </nav>
 
         {/* Mobile Dropdown Menu */}
         {menuOpen && (
           <div className="md:hidden bg-white shadow-lg border-t border-gray-200 animate-slideDown">
             <ul className="flex flex-col items-center py-4 space-y-3">
               {[...baseLinks, ...(user ? [] : guestLinks)].map((link) => {
                 const isActive = location.pathname === link.path;
                 return (
                   <li key={link.name}>
                     <Link
                       to={link.path}
                       onClick={() => setMenuOpen(false)}
                       className={`block px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                         isActive
                           ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                           : "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-md"
                       }`}
                     >
                       {link.name}
                     </Link>
                   </li>
                 );
               })}
 
               {user && (
                 <>
                   <li>
                     <Link
                       to="/dashboard"
                       onClick={() => setMenuOpen(false)}
                       className="block px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-md transition-all"
                     >
                       Dashboard
                     </Link>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         setMenuOpen(false);
                         setShowLogoutModal(true);
                       }}
                       className="block w-full px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md transition-all"
                     >
                       Logout
                     </button>
                   </li>
                 </>
               )}
             </ul>
           </div>
         )}
       </header>
 
       {/* Logout Confirmation Modal */}
       {showLogoutModal && (
         <div className="fixed inset-0 bg-black/50 flex items-end justify-center md:items-center z-[60] animate-fadeIn">
           <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center transform animate-slideUp">
             <h3 className="text-lg font-semibold text-gray-800 mb-2">
               Confirm Logout
             </h3>
             <p className="text-gray-500 text-sm mb-6">
               Are you sure you want to logout of your account?
             </p>
 
             <div className="flex justify-center gap-4">
               <button
                 onClick={() => setShowLogoutModal(false)}
                 className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
               >
                 Cancel
               </button>
               <button
                 onClick={handleLogout}
                 className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:from-red-600 hover:to-rose-700 transition-all"
               >
                 Logout
               </button>
             </div>
           </div>
         </div>
       )}
     </>
   );
 };
 
 export default Navbar;
 