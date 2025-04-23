import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coverPhoto from '../../assets/coverphoto.png';
import Logo from '../../assets/Logo2.png';
import Footer from '../../components/Footer/Footer';
import { authService } from '../../services/authService'; // update path if needed
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      newErrors.password = 'Password is required.';
    } else if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      newErrors.password = 'Password must be at least 8 characters, include one uppercase letter and one digit.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await authService.register(formData.email, formData.password, formData.role);
      console.log('Registration successful:', data);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error.message);
      setErrors(prev => ({
        ...prev,
        email: 'Registration failed. Email might be invalid or already in use.'
      }));
    }
  };

  return (
    <div className="register-container">
      <div className="register-background" style={{ backgroundImage: `url(${coverPhoto})` }}>
        <div className="background-gradient" />
      </div>

      <header className="register-header">
        <Link to="/" className="logo-link">
          <img src={Logo} alt="Tenflix" className="tenflix-logo" />
        </Link>
      </header>

      <main className="register-content">
        <div className="register-form-container">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <input
                type="email"
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

            <button type="submit" className="register-button">Sign Up</button>

            <div className="login-link">
              <span>Already have an account?</span>
              <Link to="/login">Sign in now</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
