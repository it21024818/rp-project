import { Navigate, useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { checkLogin } from './Utils/Generals';
import SignInSide from './content/signIn/signInCard';

function App() {
  const content = useRoutes(router);

  const isLoggedIn = checkLogin();

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {isLoggedIn ? content : <SignInSide />}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
