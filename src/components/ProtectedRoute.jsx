import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(StoreContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
