import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/logo2.png'
import { FaSearch, FaBell, FaCaretDown, FaSignOutAlt } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

function Navbar({ selectedProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='navbar' >
      <div className="navbar-left">
        <img src={logo} alt="" onClick={() => handleNavClick('/')} style={{ cursor: 'pointer' }} />
        <ul>
          <li 
            className={isActive('/') ? 'active' : ''} 
            onClick={() => handleNavClick('/')}
          >
            Home
          </li>
          <li 
            className={isActive('/tv') ? 'active' : ''} 
            onClick={() => handleNavClick('/tv')}
          >
            TV Shows
          </li>
          <li 
            className={isActive('/movies') ? 'active' : ''} 
            onClick={() => handleNavClick('/movies')}
          >
            Movies
          </li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse</li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="icons">{<FaSearch/>}</div>
        <div className="icons">{<FaBell/>}</div>
        <div className="navbar-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <img 
            src={selectedProfile?.avatar || '../../assets/users/user_1.png'} 
            alt={selectedProfile?.name || 'Profile'} 
            className="profile" 
          />
          <FaCaretDown/>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar