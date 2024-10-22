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
import { styled } from "@mui/material/styles";

// Copyright Component
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

// Styled Components
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #1976d2 30%, #42a5f5 90%)",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "8px",
  padding: "10px 0",
  textTransform: "none",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #1565c0 30%, #1e88e5 90%)",
    transform: "scale(1.03)",
  },
}));

const BackgroundOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
});

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

  const GradientBox = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    borderRadius: "20px",
    padding: theme.spacing(4), // Default padding for all breakpoints
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.4)",

    // Responsive padding based on screen size
    [theme.breakpoints.up("xs")]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up("xl")]: {
      padding: theme.spacing(4),
    },
  }));

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setAlertMessage("Email and password cannot be empty.");
      setAlertSeverity("error");
      return;
    }

    try {
      const response = await sendUserInfo(data).unwrap();
      if (response.tokens && response.user) {
        localStorage.setItem("accessToken", response.tokens.accessToken);
        localStorage.setItem("refreshToken", response.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        setAlertMessage("Login successful! Redirecting...");
        setAlertSeverity("success");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setAlertMessage("Username or password is incorrect.");
      setAlertSeverity("error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", position: "relative" }}
    >
      <CssBaseline />
      {/* Left Side with Background Image */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url("/src/assets/login_side.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <BackgroundOverlay />

        <Box
          component="img"
          src="/src/assets/lighthouse_side.png"
          alt="Overlay Image"
          sx={{
            position: "absolute",
            top: "40%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "0px", // 300px width for extra small screens (mobile)
              sm: "400px", // 400px width for small screens (tablets)
              md: "500px", // 500px width for medium screens (small laptops)
              lg: "600px", // 600px width for large screens (desktops)
              xl: "700px", // 700px width for extra-large screens
            },
            height: "auto",
            zIndex: 2,
            opacity: 1,
          }}
        />
      </Grid>

      {/* Background gradient behind the glass effect */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
          zIndex: -1,
        }}
      />
      {/* Right Side (Form) */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
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
        <GradientBox
          sx={{
            mx: "auto",
            my: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Sign in to LightHouse
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
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
                shrink: true,
              }}
              autoFocus
              value={data.email}
              onChange={handleChange}
              InputProps={{
                sx: {
                  borderRadius: "8px",
                },
              }}
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
              InputLabelProps={{
                shrink: true,
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
                  borderRadius: "8px",
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ mt: 1 }}
            />
            {isLoading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}
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
            <Typography variant="body2" align="center">
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
            />
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ color: "#1976d2" }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ color: "#1976d2" }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </GradientBox>
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
