import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const getAccessToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return token && token.access_token;
};
