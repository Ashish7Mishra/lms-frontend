 import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { token } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses(token, 1);
        // Pick top 3 courses as "featured"
        setFeaturedCourses(response.data.slice(0, 3));
      } catch (err: any) {
        console.error("Error fetching featured courses:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image (optimized + medium height) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-700 ease-in-out scale-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=60')",
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 animate-fadeInUp">
          <p className="uppercase text-sm md:text-base tracking-widest text-gray-300 mb-2">
            Welcome to Learnify
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Unlock Your Potential
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100">
            Learn new skills, upgrade your career, and grow with expert-led
            courses.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Browse Courses
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-md hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:shadow-lg transition-all duration-300"
            >
              Become an Instructor
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Featured Courses Section ===== */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Featured Courses
        </h2>

        {isLoading ? (
          <p className="text-gray-500">Loading featured courses...</p>
        ) : error ? (
          <p className="text-red-500">Error loading courses: {error}</p>
        ) : featuredCourses.length === 0 ? (
          <p className="text-gray-600">No featured courses available yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
            {featuredCourses.map((course: any) => (
              <div
                key={course._id}
                className="bg-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={
                    course.imageUrl ||
                    "https://images.unsplash.com/photo-1584697964198-ef56a7b6b97d?auto=format&fit=crop&w=800&q=60"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6 text-left">
                  <h3 className="text-xl font-semibold mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/courses"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            View More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
