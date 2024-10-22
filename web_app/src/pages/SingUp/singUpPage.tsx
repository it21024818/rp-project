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
} from "../../store/apiquery/AuthApiSlice";
import { styled } from "@mui/material/styles";
import backgroundImage from "../../assets/back.jpeg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #3f51b5, #2196f3)",
  color: "#fff",
  textTransform: "none",
  fontWeight: "bold",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    background: "linear-gradient(45deg, #304ffe, #1e88e5)",
    transform: "scale(1.05)",
  },
  "&:disabled": {
    background: "rgba(63, 81, 181, 0.7)",
  },
}));

const GradientBox = styled(Box)({
  background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
  borderRadius: "20px",
  padding: "40px",
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
});

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

  const BlurredBackground = styled(Box)({
    position: "fixed", // Full-screen background
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -1, // Push background behind content
    filter: "blur(10px)", // Apply blur effect
    backdropFilter: "blur(10px)", // Double-blur effect for frosted glass look
  });

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

  return (
    <>
      <BlurredBackground />
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <GradientBox
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Create Your Account
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "text.secondary", textAlign: "center" }}
          >
            Join us and get access to exclusive content
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={7}>
              <Grid item xs={12} sm={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  error={validationErrors.lastName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
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
                  autoComplete="email"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
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
                  autoComplete="password"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={validationErrors.password}
                  helperText={passwordErrorMessage} // Show the password error message
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I accept all the terms and conditions."
                  sx={{ color: "text.secondary" }}
                />
              </Grid>
            </Grid>
            <GradientButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
            </GradientButton>
          </Box>
        </GradientBox>

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
    </>
  );
}
