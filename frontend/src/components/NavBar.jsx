import { Link } from 'react-router-dom'
import SignOut from './SignOut';


const NavBar = () => {
    return (
        <nav className="nav-bar">
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
                <Link to="/reading_lists" className="nav-link">Reading Lists</Link>
            </div>
            <SignOut/>
        </nav>
      );
}

export default NavBar