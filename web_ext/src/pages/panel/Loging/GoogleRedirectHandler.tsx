import { useEffect, useState } from "react";
import { useHandleGoogleRedirectMutation } from "../store/apiquery/AuthApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";

const GoogleRedirectHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [handleGoogleRedirect] = useHandleGoogleRedirectMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (code) {
        try {
          const response = await handleGoogleRedirect(code).unwrap();
          const { tokens, user } = response;

          console.log("Tokens:", tokens);
          console.log("User:", user);

          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          navigate("/");
          window.location.reload();
        } catch (err) {
          console.error("Error handling Google redirect:", err);
        }
      }

      setLoading(false);
    };

    handleGoogleAuth();
  }, [location, handleGoogleRedirect, navigate]);

  return (
    <div>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: alpha("#000", 0.5),
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <CircularProgress size={80} color="primary" />
        </Box>
      )}
    </div>
  );
};

export default GoogleRedirectHandler;
