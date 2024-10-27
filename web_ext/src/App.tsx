import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/panel/landingPage/LandingPage";
import LoginPage from "./pages/panel/Loging/loginPage";
import SingUpPage from "./pages/panel/SingUp/singUpPage";

import * as React from "react";
import { PaletteMode } from "@mui/material";
import getLPTheme from "./pages/panel/themes/theme";
import AppAppBar from "./pages/panel/components/Header/Header";
import Footer from "./pages/panel/components/Footer/Footer";
import { CssBaseline } from "@mui/material";

function App() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const shouldShowAppBar = !["/login", "/signup"].includes(location.pathname);
  const shouldShowBottomBar = !["/login", "/signup"].includes(
    location.pathname
  );

  return (
    <ThemeProvider theme={LPtheme}>
      {shouldShowAppBar && (
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      )}
      <CssBaseline />
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SingUpPage />} />
      </Routes>
      {shouldShowBottomBar && <Footer />}
    </ThemeProvider>
  );
}

export default App;
