import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import LoginPage from "./Loging/loginPage";
import SingUpPage from "./SingUp/singUpPage";

import * as React from "react";
import { PaletteMode } from "@mui/material";
import getLPTheme from "./themes/theme";
import AppAppBar from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../../store";
import { Provider } from "react-redux";

import GoogleRedirectHandler from "./Loging/GoogleRedirectHandler";

function AppPannel() {
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
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={LPtheme}>
          {shouldShowAppBar && (
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
          )}
          <CssBaseline />
          {/* <LandingPage /> */}
          <Routes>
            <Route path={"/"} element={<LandingPage />} />
            <Route
              path="/v1/auth/oauth/google/redirect"
              element={<GoogleRedirectHandler />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SingUpPage />} />
          </Routes>
          {/* {shouldShowBottomBar && <Footer />} */}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default AppPannel;
