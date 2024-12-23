import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import InputFileUpload from "../FileUploadButton/FileUploadButton";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import RadialBarChart from "./RadialBarChart";
import Reviews from "../Reviews/Reviews";
import { checkLogin } from "../../Utils/Generals";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import LoginPage from "../../Loging/loginPage";

import { usePredictionMutation } from "../../store/apiquery/predictionsApiSlice";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SourceIcon from "@mui/icons-material/Source";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";

import { SearchResult } from "../../../../../types";

const BorderLinearProgress = styled(LinearProgress)<{
  cl1: string;
  cl2: string;
}>(({ theme, cl1, cl2 }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? cl1 : cl2,
  },
}));

import { useRef } from "react";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    maxHeight: "400px",
    overflow: "auto",
  },
});
import Snackbar from "@mui/material/Snackbar";

export default function Hero() {
  const resultRef = useRef<HTMLElement | null>(null);
  const [makePrediction, result] = usePredictionMutation();

  // Side panel component
  const [selectedText, setSelectedText] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");

  useEffect(() => {
    // Retrieve the selected text from chrome.storage.session
    chrome.storage.session.get("selectedText", (result) => {
      if (result.selectedText) {
        setSelectedText(result.selectedText); // Update state with the selected text
      }
    });
  }, []);

  useEffect(() => {
    // Retrieve the selected text from chrome.storage.session
    chrome.storage.session.get("url", (result) => {
      if (result.url) {
        setSelectedUrl(result.url || "http://www.google.com"); // Update state with the selected text
      }
    });
  }, []);

  // Listen for messages from the background script
  useEffect(() => {
    const messageListener = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (message.action === "sendTextToSidePanel") {
        setSelectedText(message.text);
        setSelectedUrl(message.url || "http://www.google.com");
      }
    };

    // Add the message listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Clean up the listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const [formData, setFormData] = useState({
    text: selectedText,
    url: selectedUrl || "http://www.google.com",
  });

  const navigate = useNavigate();

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      text: selectedText,
    }));
  }, [selectedText]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      url: selectedUrl || "http://www.google.com",
    }));
  }, [selectedUrl]);

  const [openModal, setOpenModal] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "error"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData.text);

    if (checkLogin()) {
      try {
        const result = await makePrediction(formData);

        if ("data" in result && result.data) {
          if (result.data?.status != "COMPLETED") {
            setAlertMessage("An error occurred!..");
            setAlertSeverity("error");
          }
          console.log("Prediction done successfully");
          setFormData({
            text: "",
            url: "",
          });
          console.log(result.data?.result?.biasFakeResult?.confidence);
        } else if ("error" in result && result.error) {
          console.error("Prediction failed", result.error);

          let errorMessage = "An error occurred";

          if ("data" in result.error) {
            const errorData = result.error.data as {
              message?: string;
              error?: string;
            };
            if (errorData?.message && errorData?.error) {
              errorMessage = `${errorData.message}: ${errorData.error}`;
            }
          } else if ("message" in result.error) {
            errorMessage = result.error.message || "An error occurred";
          }

          setAlertMessage(errorMessage); // Display the error message in the alert
          setAlertSeverity("error");
        }
      } catch (error) {
        console.error("Prediction done failed`", error);
      }
    } else {
      setOpenModal(true); // Open the modal
      return;
    }
  };

  useEffect(() => {
    if (result?.isSuccess && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result?.isSuccess]);

  // Handle closing the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleGoToLogin = () => {
    setShowLoginPage(true); // Set state to show the LoginPage
    setOpenModal(false);
  };

  console.log(result?.data);

  return (
    <div>
      {showLoginPage ? (
        <LoginPage /> // Render LoginPage when state is true
      ) : (
        <Box
          id="hero"
          sx={(theme) => ({
            width: "100%",
            backgroundImage:
              theme.palette.mode === "light"
                ? "linear-gradient(180deg, #CEE5FD, #FFF)"
                : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
            backgroundSize: "100% 20%",
            backgroundRepeat: "no-repeat",
          })}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: { xs: 14, sm: 20 },
              pb: { xs: 8, sm: 12 },
            }}
          >
            <Stack
              spacing={2}
              useFlexGap
              sx={{ width: { xs: "100%", sm: "70%" } }}
            >
              <Typography
                variant="h1"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignSelf: "center",
                  textAlign: "center",
                  fontSize: "clamp(3.5rem, 10vw, 4rem)",
                }}
              >
                Check Out Our&nbsp;
                <Typography
                  component="span"
                  variant="h1"
                  sx={{
                    fontSize: "clamp(3rem, 10vw, 4rem)",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "primary.main"
                        : "primary.light",
                  }}
                >
                  Extension
                </Typography>
              </Typography>
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
              >
                Explore our cutting-edge fake news detection web extention,
                Unveiling Truth in a Sea of Information: Your Guide to Fake News
                Detection in real life.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignSelf="center"
                spacing={1}
                useFlexGap
                sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    window.open(
                      "https://chromewebstore.google.com/?pli=1",
                      "_blank"
                    )
                  }
                >
                  Get Extension now
                </Button>
              </Stack>
              <Typography
                variant="caption"
                textAlign="center"
                sx={{ opacity: 0.8 }}
              >
                By clicking &quot;Download now&quot; you will able to use our
                web extention&nbsp;
                {/* <Link href="#" color="primary">
              Terms & Conditions
            </Link> */}
                .
              </Typography>
            </Stack>
            <Box
              id="image"
              sx={(theme) => ({
                mt: { xs: 8, sm: 10 },
                alignSelf: "center",
                height: { xs: 400, sm: 400 },
                width: "100%",
                backgroundImage:
                  theme.palette.mode === "light"
                    ? 'url("/static/images/templates/templates-images/hero-light.png")'
                    : 'url("/static/images/templates/templates-images/hero-dark.png")',
                backgroundSize: "cover",
                borderRadius: "10px",
                outline: "1px solid",
                outlineColor:
                  theme.palette.mode === "light"
                    ? alpha("#BFCCD9", 0.5)
                    : alpha("#9CCCFC", 0.1),
                boxShadow:
                  theme.palette.mode === "light"
                    ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                    : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                textAlign: "center",
              })}
              display="flex"
              flexDirection="column"
            >
              {/* <InputFileUpload /> */}
              <Typography
                textAlign="center"
                color="text.secondary"
                variant="h6"
                sx={{
                  alignSelf: "center",
                  width: { sm: "100%", md: "100%" },
                  marginTop: "20px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                Unveiling Truth in a Sea of Information: Your Guide to Fake News
                Detection.
              </Typography>

              <TextField
                id="outlined-multiline-static"
                label="Insert your news article "
                type="text"
                name="text"
                value={formData.text}
                onChange={handleValue}
                multiline
                rows={7}
                defaultValue="Default Value"
                sx={{
                  alignSelf: "center",
                  width: { sm: "80%", md: "80%" },
                  marginTop: "20px",
                }}
              />

              <Button
                variant="outlined"
                sx={{
                  alignSelf: "center",
                  width: { sm: "10%", md: "10%" },
                  marginTop: "20px",
                }}
                startIcon={<CheckCircleIcon />}
                onClick={handleSubmit}
                disabled={result.isLoading}
              >
                Check
              </Button>
            </Box>

            {/* New Box for the results */}

            {result?.isSuccess ? (
              <Box
                id="image"
                ref={resultRef}
                sx={(theme) => ({
                  mt: { xs: 8, sm: 10 },
                  alignSelf: "center",
                  width: "100%",
                  backgroundImage:
                    theme.palette.mode === "light"
                      ? 'url("/static/images/templates/templates-images/hero-light.png")'
                      : 'url("/static/images/templates/templates-images/hero-dark.png")',
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  outline: "1px solid",
                  outlineColor:
                    theme.palette.mode === "light"
                      ? alpha("#BFCCD9", 0.5)
                      : alpha("#9CCCFC", 0.1),
                  boxShadow:
                    theme.palette.mode === "light"
                      ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                      : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                  textAlign: "center",
                  padding: 2,
                })}
                display="flex"
                flexDirection="column"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      id="image"
                      sx={(theme) => ({
                        mt: { xs: 8, sm: 4 },
                        alignSelf: "center",
                        width: "100%",
                        backgroundImage:
                          theme.palette.mode === "light"
                            ? 'url("/static/images/templates/templates-images/hero-light.png")'
                            : 'url("/static/images/templates/templates-images/hero-dark.png")',
                        backgroundSize: "cover",
                        borderRadius: "10px",
                        outline: "1px solid",
                        outlineColor:
                          theme.palette.mode === "light"
                            ? alpha("#BFCCD9", 0.5)
                            : alpha("#9CCCFC", 0.1),
                        boxShadow:
                          theme.palette.mode === "light"
                            ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                            : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                        textAlign: "center",
                        padding: 2,
                      })}
                      display="flex"
                      flexDirection="column"
                    >
                      <Typography
                        textAlign="center"
                        color="text.secondary"
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "20px",
                          color: "#000000",
                          letterSpacing: "0.5px",
                          lineHeight: "1.5",
                        }}
                      >
                        Inserted News Article
                      </Typography>

                      <StyledTextField
                        multiline
                        variant="outlined"
                        value={result.data?.text}
                        sx={{ padding: "20px" }}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                      />

                      {result?.data?.result?.finalFakeResult == true ? (
                        <Alert
                          severity="error"
                          color="error"
                          variant="outlined"
                          sx={{
                            marginLeft: "20px",
                            marginRight: "20px",
                            backgroundColor: "#FFAD60",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            padding: "15px",
                            borderRadius: "8px",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#E4003A",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          This news a false news.
                        </Alert>
                      ) : (
                        <Alert
                          severity="success"
                          color="success"
                          variant="filled"
                          sx={{
                            marginLeft: "20px",
                            marginRight: "20px",
                            backgroundColor: "#DCF3EB",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            padding: "15px",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2e7d32",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          This is true news.
                        </Alert>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      id="image"
                      sx={(theme) => ({
                        mt: { xs: 2, sm: 2 },
                        alignSelf: "center",
                        width: "100%",
                        backgroundImage:
                          theme.palette.mode === "light"
                            ? 'url("/static/images/templates/templates-images/hero-light.png")'
                            : 'url("/static/images/templates/templates-images/hero-dark.png")',
                        backgroundSize: "cover",
                        borderRadius: "10px",
                        outline: "1px solid",
                        outlineColor:
                          theme.palette.mode === "light"
                            ? alpha("#BFCCD9", 0.5)
                            : alpha("#9CCCFC", 0.1),
                        boxShadow:
                          theme.palette.mode === "light"
                            ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                            : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                        textAlign: "center",
                        padding: 2,
                      })}
                      display="flex"
                      flexDirection="column"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: 1,
                          mt: 1, // Margin at the top
                        }}
                      >
                        <PlagiarismIcon
                          sx={{ color: "#4caf50", fontSize: 28, mr: 2 }}
                        />{" "}
                        {/* Icon */}
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#2e7d32"
                          sx={{
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Subtle text shadow
                          }}
                        >
                          Model Results
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              maxWidth: 600,
                              margin: "auto",
                              marginTop: 4,
                              padding: 3,
                              backgroundColor:
                                "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient for background
                              borderRadius: 4, // Rounded corners
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                              transition: "transform 0.3s ease-in-out", // Smooth hover effect
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <CrisisAlertIcon
                                  sx={{ fontSize: 40, color: "#00ACC1", mr: 2 }}
                                />{" "}
                                {/* Icon */}
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  color="#00796B"
                                  gutterBottom
                                >
                                  Sarcasm Detection
                                </Typography>
                              </Box>

                              <Typography variant="body1" color="textPrimary">
                                <strong>Prediction:</strong>{" "}
                                {result?.data?.result?.sarcasmPresentResult
                                  ?.prediction == "true"
                                  ? "Sarcasm Present"
                                  : "No Sarcasm"}
                              </Typography>

                              {/* Add additional styling for results */}
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                mt={1}
                              >
                                This result is based on the analysis of sarcasm
                                presence in the content.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              maxWidth: 600,
                              margin: "auto",
                              marginTop: 4,
                              padding: 3,
                              backgroundColor:
                                "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient background
                              borderRadius: 4,
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                              transition: "transform 0.3s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <CrisisAlertIcon
                                  sx={{ fontSize: 40, color: "#00ACC1", mr: 2 }}
                                />{" "}
                                {/* Icon */}
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  color="#00796B"
                                  gutterBottom
                                >
                                  Type of Sarcasm
                                </Typography>
                              </Box>

                              <Typography variant="body1" color="textPrimary">
                                <strong>Prediction:</strong>{" "}
                                {
                                  result?.data?.result?.sarcasmTypeResult
                                    ?.prediction
                                }
                              </Typography>

                              <Typography
                                variant="caption"
                                color="textSecondary"
                                mt={1}
                              >
                                This result indicates the type of sarcasm
                                detected in the text.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              maxWidth: 600,
                              margin: "auto",
                              marginTop: 4,
                              padding: 3,
                              backgroundColor:
                                "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient for background
                              borderRadius: 4, // Rounded corners
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                              transition: "transform 0.3s ease-in-out", // Smooth hover effect
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <HistoryEduIcon
                                  sx={{ fontSize: 40, color: "#F95454", mr: 2 }}
                                />{" "}
                                {/* Icon */}
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  color="#C62E2E"
                                  gutterBottom
                                >
                                  Sentiment Detection
                                </Typography>
                              </Box>

                              <Typography variant="body1" color="textPrimary">
                                <strong>Prediction:</strong>{" "}
                                {
                                  result?.data?.result?.sentimentTypeResult
                                    ?.prediction
                                }
                              </Typography>

                              {/* Add additional styling for results */}
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                mt={1}
                              >
                                This result is based on the analysis of
                                sentiment presence in the content.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              maxWidth: 600,
                              margin: "auto",
                              marginTop: 4,
                              padding: 3,
                              backgroundColor:
                                "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient background
                              borderRadius: 4,
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                              transition: "transform 0.3s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <HistoryEduIcon
                                  sx={{ fontSize: 40, color: "#F95454", mr: 2 }}
                                />{" "}
                                {/* Icon */}
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  color="#C62E2E"
                                  gutterBottom
                                >
                                  Text type of Sentiment
                                </Typography>
                              </Box>

                              <Typography variant="body1" color="textPrimary">
                                <strong>Prediction:</strong>{" "}
                                {
                                  result?.data?.result?.sentimentTextTypeResult
                                    ?.prediction
                                }
                              </Typography>

                              <Typography
                                variant="caption"
                                color="textSecondary"
                                mt={1}
                              >
                                This result indicates the type of sentiment
                                detected in the text.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              maxWidth: 1500,
                              margin: "auto",
                              marginTop: 4,
                              padding: 3,
                              backgroundColor:
                                "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient for background
                              borderRadius: 4, // Rounded corners
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                              transition: "transform 0.3s ease-in-out", // Smooth hover effect
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <FactCheckIcon
                                  sx={{ fontSize: 40, color: "#7E60BF", mr: 2 }}
                                />{" "}
                                {/* Icon */}
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  color="#433878"
                                  gutterBottom
                                >
                                  Text Quality Detection
                                </Typography>
                              </Box>

                              <Typography variant="body1" color="textPrimary">
                                <strong>Prediction:</strong>{" "}
                                {result?.data?.result?.textQualityResult
                                  ?.prediction == "true"
                                  ? "Good Text Quality"
                                  : "Bad Text Quality"}
                              </Typography>

                              {/* Add additional styling for results */}
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                mt={1}
                              >
                                This result is based on the analysis of Text
                                quality presence in the content.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card
                            sx={{
                              maxWidth: 1500,
                              margin: "auto",
                              marginTop: 4,
                              padding: 3,
                              backgroundColor:
                                "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient for background
                              borderRadius: 4, // Rounded corners
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                              transition: "transform 0.3s ease-in-out", // Smooth hover effect
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <HandshakeIcon
                                  sx={{ fontSize: 40, color: "#FF9100", mr: 2 }}
                                />{" "}
                                {/* Icon */}
                                <Typography
                                  variant="h6"
                                  component="div"
                                  fontWeight="bold"
                                  color="#E85C0D"
                                  gutterBottom
                                >
                                  Bias Detection
                                </Typography>
                              </Box>

                              <Typography variant="body1" color="textPrimary">
                                <strong>Prediction:</strong>{" "}
                                {result?.data?.result?.biasResult
                                  ?.prediction === "LEFT"
                                  ? "Left-Leaning Bias Detected"
                                  : result?.data?.result?.biasResult
                                        ?.prediction === "CENTER"
                                    ? "Neutral/Center Bias Detected"
                                    : result?.data?.result?.biasResult
                                          ?.prediction === "RIGHT"
                                      ? "Right-Leaning Bias Detected"
                                      : "Unknown Bias"}
                              </Typography>

                              {/* Add additional styling for results */}
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                mt={1}
                              >
                                This result is based on the analysis of Bias
                                presence in the content.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      id="image"
                      sx={(theme) => ({
                        mt: { xs: 2, sm: 2 },
                        alignSelf: "center",
                        width: "100%",
                        backgroundImage:
                          theme.palette.mode === "light"
                            ? 'url("/static/images/templates/templates-images/hero-light.png")'
                            : 'url("/static/images/templates/templates-images/hero-dark.png")',
                        backgroundSize: "cover",
                        borderRadius: "10px",
                        outline: "1px solid",
                        outlineColor:
                          theme.palette.mode === "light"
                            ? alpha("#BFCCD9", 0.5)
                            : alpha("#9CCCFC", 0.1),
                        boxShadow:
                          theme.palette.mode === "light"
                            ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                            : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                        textAlign: "center",
                        padding: "20px",
                      })}
                      display="flex"
                      flexDirection="column"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1, // Margin at the top
                        }}
                      >
                        <SourceIcon
                          sx={{ color: "#EB5B00", fontSize: 28, mr: 2 }}
                        />{" "}
                        {/* Icon */}
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#EB5B00"
                          sx={{
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Subtle text shadow
                          }}
                        >
                          News Sources
                        </Typography>
                      </Box>
                      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                        {result?.data?.searchResults?.map(
                          (searchResult: SearchResult, index: number) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card
                                sx={{
                                  maxWidth: 1500,
                                  maxHeight: 400,
                                  minHeight: 400,
                                  margin: "auto",
                                  marginTop: 2,
                                  padding: 3,
                                  backgroundColor:
                                    "linear-gradient(135deg, #E0F7FA 30%, #F5F5F5 90%)", // Gradient for background
                                  borderRadius: 4, // Rounded corners
                                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                                  transition: "transform 0.3s ease-in-out", // Smooth hover effect
                                  cursor: "pointer",
                                  "&:hover": {
                                    transform: "scale(1.05)", // Slight zoom on hover
                                  },
                                }}
                                onClick={() =>
                                  window.open(searchResult?.link, "_blank")
                                }
                              >
                                <CardMedia
                                  sx={{ height: 140 }}
                                  image={
                                    searchResult?.thumbnail?.[0]?.src ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAD4C_d3004nh_n_-dTCPbsPtI7c0kyEWBmg3uMZvtXU7xbmElTMASozE&s"
                                  }
                                  title="Thumbnail"
                                />
                                <CardContent>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                  >
                                    Title: {searchResult?.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {searchResult?.description}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      id="image"
                      sx={(theme) => ({
                        mt: { xs: 2, sm: 2 },
                        alignSelf: "center",
                        width: "100%",
                        backgroundImage:
                          theme.palette.mode === "light"
                            ? 'url("/static/images/templates/templates-images/hero-light.png")'
                            : 'url("/static/images/templates/templates-images/hero-dark.png")',
                        backgroundSize: "cover",
                        borderRadius: "10px",
                        outline: "1px solid",
                        outlineColor:
                          theme.palette.mode === "light"
                            ? alpha("#BFCCD9", 0.5)
                            : alpha("#9CCCFC", 0.1),
                        boxShadow:
                          theme.palette.mode === "light"
                            ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                            : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                        textAlign: "center",
                        padding: "20px",
                      })}
                      display="flex"
                      flexDirection="column"
                    >
                      <Reviews id={result?.data?._id} />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              ""
            )}
          </Container>

          <Dialog open={openModal} onClose={handleClose}>
            <DialogTitle>{"Please Login First"}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Please login first to check fake news.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGoToLogin} variant="contained">
                Go to Login
              </Button>
            </DialogActions>
          </Dialog>

          {/* Full-screen Circular Progress with blur background */}
          {result.isLoading && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: alpha("#000", 0.5),
                backdropFilter: "blur(10px)", // Blur effect for the background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 3000, // Ensure the progress is above other content
              }}
            >
              <CircularProgress size={80} color="primary" />
            </Box>
          )}
          {/* Snackbar for displaying alerts */}
          <Snackbar
            open={!!alertMessage}
            autoHideDuration={6000}
            onClose={() => setAlertMessage("")}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setAlertMessage("")}
              severity={alertSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </div>
  );
}
