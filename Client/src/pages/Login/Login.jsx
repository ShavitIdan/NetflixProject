import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coverPhoto from '../../assets/coverphoto.png';
import Logo from '../../assets/Logo2.png';
import Footer from '../../components/Footer/Footer';
import './Login.css';
import { authService } from '../../services/authService';
import { useAuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Please enter a valid email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Your password must contain at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    setServerError('');
    
    try {
      console.log('Attempting login with:', formData.email);
      const response = await authService.login(formData.email, formData.password);
      console.log('Login response:', response);
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      console.log('Calling login with token:', response.token);
      await login(response.token);
      console.log('Login successful, navigating to profile');
      
      // Redirect to profile page
      navigate('/profile', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setServerError(error.message || 'Invalid email or password');
      setErrors(prev => ({
        ...prev,
        password: 'Invalid email or password.'
      }));
    } finally {
      setIsLoading(false);
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
          {serverError && <div className="server-error">{serverError}</div>}
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

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

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
