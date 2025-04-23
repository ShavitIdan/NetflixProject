import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { authService } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
  
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      newErrors.password = 'Password must be at least 8 characters, include one uppercase letter and one digit.';
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
  
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const data = await authService.register(formData.email, formData.password);
  
      console.log('Registration successful:', data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.message);
      setErrors(prev => ({
        ...prev,
        email: 'Registration failed. Email might be in use or invalid.'
      }));
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-background">
        <img src="/netflix-background.jpg" alt="" />
        <div className="background-gradient" />
      </div>

      <header className="register-header">
        <img src="/netflix-logo.png" alt="Netflix" className="netflix-logo" />
        <Link to="/login" className="signin-link">Sign In</Link>
      </header>

      <main className="register-content">
        <div className="register-form-container">
          <h1>Create Account</h1>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
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
                placeholder="Add a password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                <option value="user">Regular User</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <button type="submit" className="register-button">Create Account</button>
          </form>

          <div className="register-footer">
            <small className="recaptcha-terms">
              This page is protected by Google reCAPTCHA to ensure you're not a bot. 
              <a href="#"> Learn more.</a>
            </small>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register; 