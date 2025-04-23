import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <p>Questions? Call <a href="tel:1-844-505-2993">1-844-505-2993</a></p>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <Link to="/">FAQ</Link>
            <Link to="/">Investor Relations</Link>
            <Link to="/">Ways to Watch</Link>
            <Link to="/">Corporate Information</Link>
            <Link to="/">Only on Netflix</Link>
          </div>
          
          <div className="footer-links-column">
            <Link to="/">Help Center</Link>
            <Link to="/">Jobs</Link>
            <Link to="/">Terms of Use</Link>
            <Link to="/">Contact Us</Link>
          </div>
          
          <div className="footer-links-column">
            <Link to="/">Account</Link>
            <Link to="/">Redeem Gift Cards</Link>
            <Link to="/">Privacy</Link>
            <Link to="/">Speed Test</Link>
          </div>
          
          <div className="footer-links-column">
            <Link to="/">Media Center</Link>
            <Link to="/">Buy Gift Cards</Link>
            <Link to="/">Cookie Preferences</Link>
            <Link to="/">Legal Notices</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="language-selector">
            <select>
              <option value="en">English</option>
              <option value="he">עברית</option>
            </select>
          </div>
          <p className="copyright">Netflix Israel</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 