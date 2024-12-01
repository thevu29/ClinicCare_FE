import { useState } from "react";
import { AuthContext } from "./authContext";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? JSON.parse(storedToken) : null;
  });

  const saveToken = (data) => {
    setToken(data);
    localStorage.setItem("token", JSON.stringify(data));
  };

  const removeToken = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
