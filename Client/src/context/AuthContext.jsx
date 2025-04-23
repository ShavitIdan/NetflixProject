import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  const validateToken = async (token) => {
    try {
      console.log('Validating token...');
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const isValid = response.ok;
      console.log('Token validation result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      console.log('Checking auth status...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setIsAuth(false);
        setUser(null);
        return;
      }

      const isValid = await validateToken(token);
      if (!isValid) {
        console.log('Token is invalid');
        localStorage.removeItem('token');
        setIsAuth(false);
        setUser(null);
        return;
      }

      // Get user data with profiles
      console.log('Fetching user data...');
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('User data fetched:', userData);
      setUser(userData);
      setIsAuth(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setIsAuth(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (token) => {
    try {
      console.log('Login function called with token');
      if (!token) {
        throw new Error('No token provided');
      }

      const isValid = await validateToken(token);
      if (!isValid) {
        throw new Error('Invalid token');
      }

      localStorage.setItem('token', token);
      
      // Get user data with profiles
      console.log('Fetching user data after login...');
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('User data after login:', userData);
      setUser(userData);
      setIsAuth(true);
      console.log('Auth state updated - isAuth:', true); // Debug log
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      setIsAuth(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setIsAuth(false);
    setUser(null);
  };

  const handleProfileSelection = (profile) => {
    console.log('Setting selected profile:', profile);
    setSelectedProfile(profile);
    navigate('/');
  };

  const value = {
    isAuth,
    user,
    selectedProfile,
    setSelectedProfile: handleProfileSelection,
    login,
    logout
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 