import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coverPhoto from '../../assets/coverphoto.png';
import Logo from '../../assets/Logo2.png';
import Footer from '../../compenents/Footer/Footer';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Please enter a valid email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Your password must contain between 4 and 60 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login form submitted:', formData);
      navigate('/profiles'); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-background" style={{ backgroundImage: `url(${coverPhoto})` }}>
        <div className="background-gradient" />
      </div>

      <header className="login-header">
        <img src={Logo} alt="Tenflix" className="tenflix-logo" />
      </header>

      <main className="login-content">
        <div className="login-form-container">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button type="submit" className="login-button">Sign In</button>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link to="/help" className="help-link">Need help?</Link>
            </div>
          </form>

          <div className="signup-link">
            <span>New to Netflix?</span>
            <Link to="/register">Sign up now</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
