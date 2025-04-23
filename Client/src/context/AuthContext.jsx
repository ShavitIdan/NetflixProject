import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/tokenUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
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