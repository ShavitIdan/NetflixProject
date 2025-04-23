import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/logo2.png'
import { FaSearch, FaBell, FaCaretDown } from 'react-icons/fa';

function Navbar({ selectedProfile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
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
        <div className="navbar-profile">
          <img 
            src={selectedProfile?.avatar || '../../assets/users/user_1.png'} 
            alt={selectedProfile?.name || 'Profile'} 
            className="profile" 
          />
          {<FaCaretDown/>}
        </div>
      </div>
    </div>
  )
}

export default Navbar