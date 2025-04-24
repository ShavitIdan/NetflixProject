import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import ProfileTest from './components/ProfileTest/ProfileTest';
import MyList from './pages/MyList/MyList';
import './App.css';

// Create a separate component for the routes to use AuthContext
const AppRoutes = () => {
  const { isAuth } = useAuthContext();

  console.log('AppRoutes - isAuth:', isAuth); // Debug log

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuth ? <Login /> : <Navigate to="/profile" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuth ? <Register /> : <Navigate to="/profile" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuth ? <Profile /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={isAuth ? <Home /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/tv" 
        element={isAuth ? <Home /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/movies" 
        element={isAuth ? <Home /> : <Navigate to="/login" replace />} 
      />
      <Route path="/test" element={<ProfileTest />} />
      <Route path="/my-list" element={<MyList />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
