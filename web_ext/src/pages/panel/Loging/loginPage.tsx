import { SyntheticEvent, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLoginMutation } from "../store/apiquery/AuthApiSlice";
// import { useNavigate } from "react-router-dom";
import { BASE_LOGIN_URL } from "../Utils/Generals";
import LandingPage from "../landingPage/LandingPage";
import { useNavigate } from "react-router-dom";
import SignUp from "../SingUp/singUpPage";
import GoogleButton from "react-google-button";
import { useGoogleAuthMutation } from "../store/apiquery/AuthApiSlice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://detect-lighthouse.me">
        LightHouse.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignInSide() {
  const [data, setData] = useState({
    email: "",
    password: "",
    audience: "EXTENSION",
  });

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [landSuccess, setLandSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [alertMessage, setAlertMessage] = useState(""); // Alert message state
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "error"
  ); // Alert severity state

  const [sendUserInfo, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setData({ ...data, [target.name]: target.value });
  };

  const goToSignUp = () => {
    setLandSuccess(true);
  };

  useEffect(() => {
    if (loginSuccess) {
      window.location.reload(); // Force a full page refresh
    }
  }, [loginSuccess]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check if email or password is empty
    if (!data.email || !data.password) {
      setAlertMessage("Email and password cannot be empty.");
      setAlertSeverity("error");
      return;
    }

    try {
      const response = await sendUserInfo(data).unwrap();
      if (response.tokens && response.user) {
        // Save tokens and user details to local storage
        localStorage.setItem("accessToken", response.tokens.accessToken);
        localStorage.setItem("refreshToken", response.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Show success alert
        setAlertMessage("Login successful! Redirecting...");
        setAlertSeverity("success");

        // Redirect after a delay
        setTimeout(() => {
          setLoginSuccess(true);
        }, 2000);
      }
    } catch (error) {
      // Show error alert if login fails
      setAlertMessage("Username or password is incorrect.");
      setAlertSeverity("error");
    }
  };

  const [googleAuth] = useGoogleAuthMutation();
  const handleGoogleLogin = async () => {
    try {
      const response = await googleAuth(data).unwrap();
      if (response.authorizeUrl) {
        window.location.href = response.authorizeUrl;
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goBack = () => {
    window.location.reload();
  };

  return (
    <div>
      {landSuccess ? (
        <SignUp /> // Render LandingPage when login is successful
      ) : (
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          {/* Background gradient behind the glass effect */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundImage:
                "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
              zIndex: -1,
            }}
          />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            component={Paper}
            elevation={6}
            square
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backdropFilter: "blur(60px)",
              backgroundColor: "rgba(255, 255, 255, 0.35)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "20px",
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))",
            }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={data.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={data.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                      mb: 2,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
                {/* <Typography variant="body2" align="center">
                  Or
                </Typography>
                <GoogleButton
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: "30px",
                    marginTop: "30px",
                  }}
                  onClick={handleGoogleLogin}
                /> */}

                <Grid container sx={{ mt: 5 }}>
                  <Grid item xs>
                    <Button
                      variant="contained"
                      onClick={goBack}
                      sx={{
                        background: "#fff",
                        color: "#000",
                        alignItems: "center",
                      }}
                    >
                      Go Back
                    </Button>
                  </Grid>
                  <Grid item>
                    <Link onClick={goToSignUp} variant="body2">
                      {"Don't have an account? Sign Up"}
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
            onClose={() => setAlertMessage("")}
          >
            <Alert
              onClose={() => setAlertMessage("")}
              severity={alertSeverity}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Grid>
      )}
    </div>
  );
}
