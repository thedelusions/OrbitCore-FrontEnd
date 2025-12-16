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
    <nav className="navbar">

      <ul className={`nav-menu ${menuActive ? 'active' : ''}`}>
        {user ? (
          <>
            <li><Link to='/' onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/register" onClick={handleLinkClick}>Register</Link></li>
            <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
          </>
        )}
      </ul>

      <Link to={user ? '/' : '/'} className="nav-logo" onClick={() => setMenuActive(false)}>
        Orbit Core
      </Link>

    </nav>
  );
};

export default NavBar;
