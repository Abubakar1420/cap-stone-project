// src/components/privateRoutes.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or <Spinner /> if you want a loader

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
