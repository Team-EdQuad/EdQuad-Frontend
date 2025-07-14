// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { StoreContext } from "../context/StoreContext";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useContext(StoreContext);
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;

import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ProtectedRoute = ({ children }) => {
  const { token, role, logout } = useContext(StoreContext);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    if ((!storedToken || !storedRole) && (token || role)) {
      logout();
      return;
    }

  }, [token, role, logout]);
  
  const isAuthenticated = () => {
    const hasToken = token && localStorage.getItem('token');
    const hasRole = role && localStorage.getItem('role');
    return !!(hasToken && hasRole);
  };
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;