// src/pages/HomePage.tsx

import { Link } from 'react-router-dom';

const HomePage = () => {
  
  const bannerHeight = 'calc(100vh - 4rem)'; 

  return (

    <div
      className="relative -mt-8 -mx-6" 
      style={{ height: bannerHeight }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Your Learning Journey Starts Here
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
          Discover a world of knowledge on our lightweight learning platform. Find the perfect course to kickstart your skills and achieve your goals.
        </p>
        <Link
          to="/courses"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300"
        >
          Explore Courses
        </Link>
      </div>
    </div>
  );
};

export default HomePage;