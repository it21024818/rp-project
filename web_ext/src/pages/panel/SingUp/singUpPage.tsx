import React, { SyntheticEvent, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import LandingPage from "../landingPage/LandingPage";
import Container from "@mui/material/Container";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useRegisterMutation,
  useResendRegistrationMailMutation,
  useAuthorizeUserMutation,
} from "../store/apiquery/AuthApiSlice";

export default function SignUp() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [singUpSuccess, setSingUpSuccess] = useState(false);

  const [open, setOpen] = useState(false); // State to control success modal
  const [alertMessage, setAlertMessage] = useState(""); // State for alert messages
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  ); // State for alert severity
  const [authToken, setAuthToken] = useState(""); // State for the authorization token
  const [authErrorMessage, setAuthErrorMessage] = useState(""); // Error message for auth token
  const navigate = useNavigate();
  const [sendUserInfo, { isLoading }] = useRegisterMutation();
  const [resendEmail, { isLoading: isResending }] =
    useResendRegistrationMailMutation();
  const [authorizeUser, { isLoading: isAuthorizing }] =
    useAuthorizeUserMutation();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setData({ ...data, [target.name]: target.value });
  };

  const validateFields = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {
      firstName: data.firstName.trim() === "",
      lastName: data.lastName.trim() === "",
      email: !emailPattern.test(data.email),
      password: data.password.length < 8,
    };

    setPasswordErrorMessage(
      errors.password ? "Password should be at least 8 characters." : ""
    );

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleAuthTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthToken(e.target.value);
    setAuthErrorMessage(""); // Reset error message when the user types
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateFields()) {
      setAlertMessage("Please fill all the required fields correctly.");
      setAlertSeverity("error");
      return;
    }

    try {
      await sendUserInfo(data).unwrap();
      setAlertMessage("Account created successfully! Redirecting to login...");
      setAlertSeverity("success");
      setOpen(true); // Open success modal
      // setTimeout(() => {
      // }, 5000); // 5-second delay before redirecting
    } catch (error) {
      console.log(error);
      setAlertMessage("Error registering user. Please try again.");
      setAlertSeverity("error");
      setOpen(false); // Show alert on error
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleAuthorize = async () => {
    if (!authToken.trim()) {
      setAuthErrorMessage("Auth token is required");
      return;
    }

    try {
      await authorizeUser(authToken).unwrap();
      setAlertMessage("Authorization successful! Redirecting to login...");
      setAlertSeverity("success");
      setOpen(false); // Close the dialog on success
      setTimeout(() => {
        window.location.reload();
        navigate("/login");
      }, 3000); // Delay for better UX
    } catch (error) {
      setAuthErrorMessage("Authorization failed. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendEmail(data.email);
      setAlertMessage("Verification email resent successfully!");
      setAlertSeverity("success");
    } catch (error) {
      setAlertMessage("Error resending email. Try again.");
      setAlertSeverity("error");
    }
  };

  const goBack = () => {
    window.location.reload();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(60px)",
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "20px",
          padding: "20px",
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={data.firstName}
                onChange={handleChange}
                error={validationErrors.firstName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                error={validationErrors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={validationErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={data.password}
                onChange={handleChange}
                error={validationErrors.password}
                helperText={passwordErrorMessage} // Show the password error message
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I accept all the terms and conditions."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Button
            variant="contained"
            onClick={goBack}
            sx={{
              mt: 3,
              mb: 2,
              background: "#fff",
              color: "#000",
              alignItems: "center",
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {alertMessage && (
        <Snackbar
          open={!!alertMessage}
          autoHideDuration={6000}
          onClose={() => setAlertMessage("")}
        >
          <Alert onClose={() => setAlertMessage("")} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Success Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogContentText id="alert-dialog-description">
            Account created successfully! You will be redirected shortly...
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column" }}>
          <Typography color="error" variant="body2" align="center">
            Authorize Your Account.
          </Typography>
          <br />
          <TextField
            id="auth-token"
            label="Auth Token"
            variant="outlined"
            fullWidth
            value={authToken}
            onChange={handleAuthTokenChange}
            error={!!authErrorMessage} // Display error if present
            helperText={authErrorMessage} // Show auth error message
          />
          <Box>
            <Button
              onClick={handleAuthorize}
              variant="outlined"
              disabled={isAuthorizing}
              sx={{ margin: "10px" }}
            >
              {isAuthorizing ? <CircularProgress size={20} /> : "Authorize"}
            </Button>
            <Button
              onClick={handleResendEmail}
              variant="outlined"
              disabled={isResending}
            >
              {isResending ? <CircularProgress size={20} /> : "Resend Email"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
