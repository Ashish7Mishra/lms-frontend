 import { Outlet } from "react-router-dom";
 import Header from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer /> {/* ✅ This stays at bottom now */}
    </div>
  );
};

export default MainLayout;
