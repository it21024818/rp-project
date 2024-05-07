import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";

import * as React from "react";
import { PaletteMode } from "@mui/material";
import getLPTheme from "./themes/theme";
import AppAppBar from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
