
const Navbar = () => {
    return (
        <nav className="navbar">

            <div className="container">

                <a href="/" className="brand-logo">Learnify</a>
                <ul className="nav-links">
                    <li><a href="/login">Login</a></li>
                    <li><a href="/login">Register</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;