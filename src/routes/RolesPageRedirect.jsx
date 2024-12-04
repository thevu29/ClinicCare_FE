import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/authContext";

const RoleBasedRedirect = () => {
  const { token } = useAuth();

  if (token?.role.toLowerCase() === "doctor") {
    return <Navigate to="/admin/schedules" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
};

export default RoleBasedRedirect;
