import React, { useEffect } from "react";
import { useHandleGoogleRedirectMutation } from "../../store/apiquery/AuthApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_LOGIN_URL } from "../../Utils/Generals";

const GoogleRedirectHandler = () => {
  const [handleGoogleRedirect] = useHandleGoogleRedirectMutation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (code) {
        try {
          const response = await handleGoogleRedirect(code).unwrap();
          const { tokens, user } = response;
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          // Redirect after a delay
          setTimeout(() => {
            window.location.href = BASE_LOGIN_URL;
          }, 2000);
        } catch (err) {
          console.error("Error handling Google redirect:", err);
        }
      }
    };

    handleGoogleAuth();
  }, [location, handleGoogleRedirect, navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleRedirectHandler;
