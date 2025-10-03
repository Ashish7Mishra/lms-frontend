import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError(null);
        try {

            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            login(response.data);
            setLoading(false);
            navigate('/');


        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    }

    return (
        <div className="page-container">
            <Navbar />
            <main className="container">
                <div className="auth-form-container">
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>

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

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging In...' : 'Login'}
                        </button>

                    </form>

                </div>

            </main>

            <Footer />

        </div>
    );
};
export default LoginPage;