import React, { SyntheticEvent, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useRegisterMutation,
  useResendRegistrationMailMutation,
  useAuthorizeUserMutation,
} from "../../store/apiquery/AuthApiSlice";
import { Copyright } from "@mui/icons-material";

export default function SignUp() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [open, setOpen] = useState(false); // State to control success modal
  const [resendOpen, setResendOpen] = useState(false); // Snackbar state
  const [authToken, setAuthToken] = useState(""); // State for the authorization token
  const navigate = useNavigate();
  const [sendUserInfo, { isLoading, isError }] = useRegisterMutation();
  const [resendEmail, { isLoading: isResending, isError: resendError }] =
    useResendRegistrationMailMutation();
  const [authorizeUser, { isLoading: isAuthorizing }] =
    useAuthorizeUserMutation();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setData({ ...data, [target.name]: target.value });
  };

  const handleAuthTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthToken(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await sendUserInfo(data).unwrap();
      if (result) {
        setOpen(true); // Open success modal
        console.log("User registered successfully:", result);
        setTimeout(() => {
          setOpen(false);
        }, 5000); // Close modal after 5 seconds
      }
    } catch (error) {
      setOpen(true);
      console.error("Error registering user:", error);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendEmail(data.email);
      setResendOpen(true); // Open success snackbar
    } catch (error) {
      console.error("Error resending email:", error);
    }
  };

  const handleAuthorize = async () => {
    try {
      const result = await authorizeUser(authToken).unwrap();
      if (result) {
        console.log("User authorized successfully:", result);
        setOpen(false);
        navigate("/login"); // Redirect to login on success
      }
    } catch (error) {
      console.error("Error authorizing user:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={data.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={data.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={data.password}
                onChange={handleChange}
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
          {isError && (
            <Typography color="error" variant="body2" align="center">
              Error registering user. Please try again.
            </Typography>
          )}
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />

      {/* Success Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <div>
            <iframe
              src="https://giphy.com/embed/J3iOpJrNCZGOS0M0QX"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <DialogContentText id="alert-dialog-description">
            Account created successfully! You will be redirected shortly...
          </DialogContentText>
        </DialogContent>
        <br />
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

      {/* Resend Email Snackbar */}
      <Snackbar
        open={resendOpen}
        autoHideDuration={6000}
        onClose={() => setResendOpen(false)}
        message={
          resendError
            ? "Failed to resend email. Try again."
            : "Verification email resent successfully!"
        }
      />
    </Container>
  );
}
