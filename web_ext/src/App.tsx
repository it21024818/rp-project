import { ThemeProvider, createTheme } from "@mui/material/styles";
import AuthLogin from "./components/Login/AuthLogin";
import "./App.css";
import * as React from "react";
import { PaletteMode } from "@mui/material";
import getLPTheme from "./themes/theme";

function App() {
  const [mode] = React.useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));

  return (
    <ThemeProvider theme={LPtheme}>
      {/* Add a button to toggle color mode */}
      <AuthLogin />
    </ThemeProvider>
  );
}

export default App;
