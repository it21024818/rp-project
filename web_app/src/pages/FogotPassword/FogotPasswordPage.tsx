import { useState, SyntheticEvent } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/back.jpeg";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../store/apiquery/AuthApiSlice";

// Styled Components
const GradientButton = styled(Button)(() => ({
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

const BlurredBackground = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: -1,
  filter: "blur(10px)",
  backdropFilter: "blur(10px)",
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: false,
  });
  const [validationPasswordErrors, setValidationPasswordErrors] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isTokenSent, setIsTokenSent] = useState(false);

  const navigate = useNavigate();
  const [forgotUserPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [resetUserPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "token":
        setToken(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const validateFields = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const errors = {
      email: !emailPattern.test(email),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const validatePasswordFields = () => {
    const errorsPassword = {
      newPassword: newPassword.length < 8,
      confirmPassword: confirmPassword !== newPassword,
    };

    setValidationPasswordErrors(errorsPassword);
    return !Object.values(errorsPassword).some((error) => error);
  };

  const handleSendEmail = async () => {
    if (!validateFields()) {
      setAlertMessage("Please enter a valid email address.");
      setAlertSeverity("error");
      return;
    }

    try {
      await forgotUserPassword(email).unwrap(); // Pass `email` directly as a string
      setIsTokenSent(true);
      setAlertMessage("Verification token sent to your email.");
      setAlertSeverity("success");
    } catch (error) {
      setAlertMessage("Error sending verification email. Please try again.");
      setAlertSeverity("error");
    }
  };

  const handleResetPassword = async () => {
    if (!validatePasswordFields()) {
      setAlertMessage("Passwords and confirm password do not match.");
      setAlertSeverity("error");
      return;
    }

    try {
      await resetUserPassword({
        password: newPassword,
        tokenCode: token,
      }).unwrap();
      setAlertMessage("Password reset successfully! Redirecting to login...");
      setAlertSeverity("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setAlertMessage("Error resetting password. Please try again.");
      setAlertSeverity("error");
    }
  };

  return (
    <>
      <BlurredBackground />
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          position: "fixed",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <GradientBox
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000, // Ensures it appears above other elements
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "text.secondary", textAlign: "center" }}
          >
            Enter your email to receive a reset token
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  error={validationErrors.email}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>
              {isTokenSent && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="token"
                      label="Verification Token"
                      name="token"
                      value={token}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      error={validationPasswordErrors.newPassword}
                      helperText={
                        validationPasswordErrors.newPassword
                          ? "Password must be at least 8 characters."
                          : ""
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      error={validationPasswordErrors.confirmPassword}
                      helperText={
                        validationPasswordErrors.confirmPassword
                          ? "Passwords do not match."
                          : ""
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <GradientButton
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={isTokenSent ? handleResetPassword : handleSendEmail}
              disabled={isSendingEmail || isResetting}
            >
              {isSendingEmail || isResetting ? (
                <CircularProgress size={24} />
              ) : isTokenSent ? (
                "Reset Password"
              ) : (
                "Send Reset Email"
              )}
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
      </Container>
    </>
  );
}
