import axios from "../utils/axiosCustom";

export const loginService = async (email, password) => {
  return await axios.post("/auth/login", { username: email, password });
};

export const logoutService = async () => {
  return await axios.post("/auth/logout");
};

export const getOAuth2Data = async () => {
  return await axios.get("/auth/oauth2-data", { withCredentials: true });
};

export const sendOtpService = async (email) => {
  return await axios.post("/auth/send-email-otp", { email });
};

export const verifyOtpService = async (email, otp) => {
  return await axios.post("/auth/verify-otp", { email, otp });
};

export const registerService = async (formData) => {
  return await axios.post("/auth/register", formData);
};
