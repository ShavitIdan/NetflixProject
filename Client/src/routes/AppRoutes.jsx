import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            {/* Your protected home component */}
            <div>Home Page</div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 