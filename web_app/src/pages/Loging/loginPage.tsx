import { SyntheticEvent, useState } from "react";
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
import { useLoginMutation } from "../../store/apiquery/AuthApiSlice";
import { useNavigate } from "react-router-dom";
import { useGoogleAuthMutation } from "../../store/apiquery/AuthApiSlice";
import GoogleButton from "react-google-button";

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
      <Link color="inherit" href="http://localhost:5173/">
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
    audience: "WEB_APP",
  });

  const navigate = useNavigate();

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

  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [alertMessage, setAlertMessage] = useState(""); // Alert message state
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "error"
  ); // Alert severity state

  const [sendUserInfo, { isLoading }] = useLoginMutation();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setData({ ...data, [target.name]: target.value });
  };

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
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      // Show error alert if login fails
      setAlertMessage("Username or password is incorrect.");
      setAlertSeverity("error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url("/src/assets/login_side.jpg")',
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
                sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            )}
            <Typography variant="body2" align="center">
              Or
            </Typography>
            <GoogleButton
              style={{
                marginLeft: "100px",
                marginRight: "100px",
                marginBottom: "30px",
                marginTop: "30px",
              }}
              onClick={handleGoogleLogin}
            />
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
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
  );
}
