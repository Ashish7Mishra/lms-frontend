import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InstructorDashboard = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="container">
                <h1 className="page-title">Instructor Dashboard</h1>
                <p>Here are the courses you have created.</p>
     
            </main>
            <Footer />
        </div>
    );
};
export default InstructorDashboard;