import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route, useLocation } from "react-router-dom"; // Ensure useLocation is imported
import LandingPage from "./pages/landingPage/LandingPage";
import LoginPage from "./pages/Loging/loginPage";
import SingUpPage from "./pages/SingUp/singUpPage";
import GoogleRedirectHandler from "./pages/Loging/GoogleRedirectHandler";

import * as React from "react";
import { PaletteMode } from "@mui/material";
import getLPTheme from "./themes/theme";
import AppAppBar from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CssBaseline } from "@mui/material";

function App() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const location = useLocation(); // Get the current location

  // Adjust conditions to ensure AppBar and Footer are only hidden on /login and /signup
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      {/* Show AppBar only if not on login or signup pages */}
      {!isAuthPage && (
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/v1/auth/oauth/google/redirect"
          element={<GoogleRedirectHandler />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SingUpPage />} />
      </Routes>
      {/* Show Footer only if not on login or signup pages */}
      {!isAuthPage && <Footer />}
    </ThemeProvider>
  );
}

export default App;
