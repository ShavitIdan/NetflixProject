import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo2.png'
import { FaSearch, FaBell, FaCaretDown } from 'react-icons/fa';

function Navbar({ selectedProfile }) {
  return (
    <div className='navbar' >
      <div className="navbar-left">
        <img src={logo} alt="" />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
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