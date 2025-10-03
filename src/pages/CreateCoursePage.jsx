import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CreateCoursePage = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const courseData = { title, description, category };

        try {
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/courses', courseData, config);

            setLoading(false);
            navigate('/instructor/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course.');
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="container">
                <div className="auth-form-container">
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Course</h1>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Course Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Course Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem' }}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateCoursePage;