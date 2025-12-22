import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [menuActive, setMenuActive] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMenuActive(false); // close menu on sign out
  };

  const handleLinkClick = () => {
    setMenuActive(false); // close menu on link click
  };

  return (
    <nav>
      <div className="navbar">
        <Link to="/" className="nav-logo" onClick={() => setMenuActive(false)}>
          Orbit Core
        </Link>

        <ul className={`nav-menu ${menuActive ? 'active' : ''}`}>
          <li><Link to='/projects' onClick={handleLinkClick}>Projects</Link></li>
          {user ? (
            <>
              <li><Link to='/' onClick={handleLinkClick}>Home</Link></li>
              <li><Link to='/profile' onClick={handleLinkClick}>Profile</Link></li>
              <li><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
              <li><Link to="/register" onClick={handleLinkClick}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
