import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">

            <div className="container">

                <Link to="/" className="brand-logo">
                    Mini-LMS
                </Link>
                <ul className="nav-links">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;