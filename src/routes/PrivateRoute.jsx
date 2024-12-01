import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/authContext";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (
    token.role.toLowerCase() !== "admin" &&
    token.role.toLowerCase() !== "doctor"
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
