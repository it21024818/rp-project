import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLoginMutation } from '../../store/apiquery/AuthApiSlice';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import loginBanerImage from '../../assets/loging_baner.png';

// Copyright Component
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:5173/">
        LightHouse.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Styled Components
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2 30%, #42a5f5 90%)',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '8px',
  padding: '10px 0',
  textTransform: 'none',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, #1565c0 30%, #1e88e5 90%)',
    transform: 'scale(1.03)'
  }
}));

export default function SignInSide() {
  const [data, setData] = useState({
    email: '',
    password: '',
    audience: 'WEB_APP'
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'error'
  );

  const [sendUserInfo, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value // Dynamically update the email or password field
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setAlertMessage('Email and password cannot be empty.');
      setAlertSeverity('error');
      return;
    }

    try {
      const response = await sendUserInfo(data).unwrap();
      if (response.tokens && response.user) {
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        console.log('Access Token:', response.tokens.accessToken);
        console.log('Refresh Token:', response.tokens.refreshToken);

        setAlertMessage('Login successful! Redirecting...');
        setAlertSeverity('success');

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setAlertMessage('Username or password is incorrect.');
      setAlertSeverity('error');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: '100vh',
        position: 'fixed',
        backgroundImage: `url(${loginBanerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6}></Grid>

      {/* Right Side (Form) */}
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        component={Paper}
        elevation={0}
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backdropFilter: 'blur(0px)',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          padding: '20px'
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            my: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background:
              'linear-gradient(135deg, rgba(227, 242, 253, 0.9), rgba(187, 222, 251, 0.9))',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.4)'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Sign in to LightHouse-Admin
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              InputLabelProps={{
                shrink: true
              }}
              autoFocus
              value={data.email}
              onChange={handleChange}
              InputProps={{
                sx: {
                  borderRadius: '8px'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              InputLabelProps={{
                shrink: true
              }}
              value={data.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px'
                }
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ mt: 1 }}
            />
            {isLoading ? (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </GradientButton>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ color: '#1976d2' }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>

      {/* Snackbar for displaying alerts */}
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage('')}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
