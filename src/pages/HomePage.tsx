 import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* ===== Hero Section ===== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 gap-10">
        {/* --- Left Side Text --- */}
        <div className="flex-1 text-left">
          <h2 className="text-2xl font-semibold text-[#6b7280] mb-4">
            Learning Management System
          </h2>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="text-[#FACC15]">Online</span>{" "}
            <span className="text-[#7C3AED]">Education</span>
          </h1>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Read, Write and Remember
          </h3>

          <p className="text-gray-600 max-w-md mb-6">
            Learn from anywhere and grow your career with world-class online
            courses. Build your skills and achieve your learning goals with our
            interactive platform.
          </p>

          <Link
            to="/courses"
            className="inline-block px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            View Courses
          </Link>

          {/* --- Social Icons --- */}
          <div className="flex gap-4 mt-8 text-gray-500">
            <a href="#" className="hover:text-[#7C3AED]">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="hover:text-[#7C3AED]">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="hover:text-[#7C3AED]">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
        </div>

        {/* --- Right Side Image --- */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://img.freepik.com/free-vector/online-education-illustration_1284-68476.jpg?w=1380"
            alt="Online Education"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
