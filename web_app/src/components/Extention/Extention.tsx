/* eslint-disable @typescript-eslint/no-explicit-any */
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
import React, { useState } from "react";
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

import { usePredictionMutation } from "../../store/apiquery/predictionsApiSlice";

import { SearchResult } from "../../../types";

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

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    maxHeight: "400px", // Adjust the height as needed
    overflow: "auto",
  },
});

export default function Hero() {
  const [makePrediction, result] = usePredictionMutation();

  const [formData, setFormData] = useState({
    text: "",
    url: "http://www.google.com",
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

  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData.text);

    if (checkLogin()) {
      try {
        const result = await makePrediction(formData);

        if ("data" in result && result.data) {
          console.log("Prediction done successfully");
          setFormData({
            text: "",
            url: "http://www.google.com",
          });
          console.log(result.data?.result?.biasFakeResult?.confidence);
        } else if ("error" in result && result.error) {
          console.error("Prediction done failed", result.error);
        }
      } catch (error) {
        console.error("Prediction done failed`", error);
      }
    } else {
      setOpenModal(true); // Open the modal
      return;
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpenModal(false);
  };

  // Handle redirect to the login page
  const handleGoToLogin = () => {
    navigate("/login");
  };

  console.log(result?.data);

  return (
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
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
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
              Extention
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
            {/* <TextField
              id="outlined-basic"
              hiddenLabel
              size="small"
              variant="outlined"
              aria-label="Enter your email address"
              placeholder="Your email address"
              inputProps={{
                autoComplete: "off",
                "aria-label": "Enter your email address",
              }}
            /> */}
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
            By clicking &quot;Download now&quot; you will able to use our web
            extention&nbsp;
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
            height: { xs: 200, sm: 700 },
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
            rows={20}
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
          >
            Check
          </Button>
        </Box>
        {/* New Box for the results */}

        {result?.isSuccess ? (
          <Box
            id="image"
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
              <Grid item xs={6}>
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
                  })}
                  display="flex"
                  flexDirection="column"
                >
                  <Typography
                    textAlign="left"
                    marginLeft="40px"
                    color="text.secondary"
                    variant="h6"
                    fontWeight="100px"
                    sx={{
                      alignSelf: "center",
                      width: { sm: "100%", md: "100%" },
                      marginTop: "20px",
                    }}
                  >
                    Inserted News article
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
                      severity="success"
                      color="success"
                      variant="outlined"
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        backgroundColor: "#DCF3EB",
                      }}
                    >
                      This news a true news.
                    </Alert>
                  ) : (
                    <Alert
                      severity="error"
                      color="error"
                      variant="outlined"
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        backgroundColor: "#DCF3EB",
                      }}
                    >
                      This news a false news.
                    </Alert>
                  )}
                  {result?.data?.searchResults?.map(
                    (searchResult: SearchResult, index: number) => (
                      <Card
                        key={index}
                        sx={{
                          marginLeft: "20px",
                          marginRight: "20px",
                          marginTop: "10px",
                          backgroundColor: "#F5F5F5",
                        }}
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
                          <Typography gutterBottom variant="h5" component="div">
                            Title: {searchResult?.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {searchResult?.description}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {searchResult?.link}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
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
                  })}
                  display="flex"
                  flexDirection="column"
                >
                  <Typography
                    textAlign="left"
                    marginLeft="40px"
                    color="text.secondary"
                    variant="h6"
                    fontWeight="100px"
                    sx={{
                      alignSelf: "center",
                      width: { sm: "100%", md: "100%" },
                      marginTop: "20px",
                    }}
                  >
                    Fake news detection Factors Weights
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Typography
                        textAlign="left"
                        marginLeft="40px"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        Tone of text segments
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        textAlign="left"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        {result.data?.result?.sentimentFakeResult?.confidence *
                          100}{" "}
                        %
                      </Typography>
                    </Grid>
                  </Grid>
                  <BorderLinearProgress
                    variant="determinate"
                    value={
                      result.data?.result?.sentimentFakeResult?.confidence * 100
                    }
                    sx={{
                      marginLeft: "40px",
                      marginRight: "40px",
                      marginTop: "20px",
                    }}
                    cl1={"#4A90E2"}
                    cl2={"#1A237E"}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Typography
                        textAlign="left"
                        marginLeft="40px"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        Sarcastic nature
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        textAlign="left"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        {result.data?.result?.sarcasmFakeResult?.confidence *
                          100}{" "}
                        %
                      </Typography>
                    </Grid>
                  </Grid>
                  <BorderLinearProgress
                    variant="determinate"
                    value={
                      result.data?.result?.sarcasmFakeResult?.confidence * 100
                    }
                    sx={{
                      marginLeft: "40px",
                      marginRight: "40px",
                      marginTop: "20px",
                    }}
                    cl1={"#FFB74D"}
                    cl2={"#E65100"}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Typography
                        textAlign="left"
                        marginLeft="40px"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        Political bias
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        textAlign="left"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        {result.data?.result?.biasFakeResult?.confidence * 100}{" "}
                        %
                      </Typography>
                    </Grid>
                  </Grid>
                  <BorderLinearProgress
                    variant="determinate"
                    value={
                      result.data?.result?.biasFakeResult?.confidence * 100
                    }
                    sx={{
                      marginLeft: "40px",
                      marginRight: "40px",
                      marginTop: "20px",
                    }}
                    cl1={"#81C784"}
                    cl2={"#2E7D32"}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Typography
                        textAlign="left"
                        marginLeft="40px"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        Quality of the text
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        textAlign="left"
                        color="GrayText"
                        variant="subtitle2"
                        sx={{
                          alignSelf: "center",
                          width: { sm: "100%", md: "100%" },
                          marginTop: "40px",
                        }}
                      >
                        {result.data?.result?.textFakeResult?.confidence * 100}{" "}
                        %
                      </Typography>
                    </Grid>
                  </Grid>
                  <BorderLinearProgress
                    variant="determinate"
                    value={
                      result.data?.result?.textFakeResult?.confidence * 100
                    }
                    sx={{
                      marginLeft: "40px",
                      marginRight: "40px",
                      marginTop: "20px",
                    }}
                    cl1={"#BA68C8"}
                    cl2={"#6A1B9A"}
                  />
                  <Typography
                    textAlign="left"
                    marginLeft="40px"
                    color="text.secondary"
                    variant="h6"
                    fontWeight="100px"
                    sx={{
                      alignSelf: "center",
                      width: { sm: "100%", md: "100%" },
                      marginTop: "40px",
                    }}
                  >
                    Analytics
                  </Typography>

                  <RadialBarChart result={result.data} />
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
    </Box>
  );
}
