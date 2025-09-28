import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const userData = {
            name,
            email,
            password,
            role,
        };

        try {

            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            console.log("Registration successfull:", response.data);

            setLoading(false);
            navigate('/login');

        } catch (error) {

            console.error('Registration error:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);

        }

    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="container">
                <div className="auth-form-container">

                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h1>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>

                        <div className='form-group'>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Register as</label>
                            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Student">Student</option>
                                <option value="Instructor">Instructor</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                    </form>

                </div>

            </main>

            <Footer />

        </div>
    );
};
export default RegisterPage;