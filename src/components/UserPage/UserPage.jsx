import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getOAuth2Data } from "../../services/authService";
import { useAuth } from "../../context/Auth/authContext";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const UserPage = () => {
  const { saveToken } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get("provider");

    const fetchUser = async () => {
      try {
        const res = await getOAuth2Data();

        if (res.data) {
          saveToken(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (provider === "google") {
      fetchUser();

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [saveToken]);

  return (
    <>
      <Header />
      <div id="content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default UserPage;
