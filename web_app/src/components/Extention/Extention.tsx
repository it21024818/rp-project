import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InputFileUpload from "../FileUploadButton/FileUploadButton";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

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

const value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. ...an environment where businesses and policymakers can collaborate to develop favourable regulations. What is important is that the Bill is ‘binding,’ and this binding nature of the obligations may well turn out to be directory making prescribed timelines in the Bill no longer of the essence, ensuring a commitment to achieving its targets.

Overcoming the limitations of previous laws

The agencies set up to implement the reforms discussed in this article, are proposed to replace the Board of Investment (BoI) of Sri Lanka Law, No. 4 of 1978 (BoI Law) with the Economic Commission. The effectiveness of the BOI has been mixed, with criticisms around inefficiency, political interference, and inadequate support for diverse economic activities. There is a lack of independence in the existing institutions which hinders their ability to create distinct regulatory environments tailored for economic activities for instance, the head of both the Port City Commission and the Board of Investment is currently the same person, despite the fact that the Colombo Port City Economic Commission Act is intended to operate independently from BOI Law. 

A more structured approach to economic development

The Bill proposes establishing specialised bodies or agencies: (i) The Economic Commission of Sri Lanka (EC), (ii) Investment Zones Sri Lanka (Zones SL), (iii) Office of International Trade (OIT), (iv) National Productivity Commission (NPC), and (v) Sri Lanka Institute of Exports and International Trade. By decentralising functions and responsibilities, and establishing autonomous bodies empowered to ensure timely decision-making, they can operate more efficiently without the bottlenecks often associated with a single large entity like the BOI. These agencies will also have the liberty to drive innovation by promoting research, development, and the adoption of new technologies.`;

export default function Hero() {
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
          <InputFileUpload />
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
          >
            Check
          </Button>
        </Box>
        {/* New Box for the results */}
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
                  height: { xs: 100, sm: 600 },
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
                  value={value}
                  sx={{ padding: "20px" }}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
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
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                id="image"
                sx={(theme) => ({
                  mt: { xs: 8, sm: 4 },
                  alignSelf: "center",
                  height: { xs: 200, sm: 600 },
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
                      30%
                    </Typography>
                  </Grid>
                </Grid>
                <BorderLinearProgress
                  variant="determinate"
                  value={50}
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
                      30%
                    </Typography>
                  </Grid>
                </Grid>
                <BorderLinearProgress
                  variant="determinate"
                  value={50}
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
                      30%
                    </Typography>
                  </Grid>
                </Grid>
                <BorderLinearProgress
                  variant="determinate"
                  value={50}
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
                      30%
                    </Typography>
                  </Grid>
                </Grid>
                <BorderLinearProgress
                  variant="determinate"
                  value={50}
                  sx={{
                    marginLeft: "40px",
                    marginRight: "40px",
                    marginTop: "20px",
                  }}
                  cl1={"#BA68C8"}
                  cl2={"#6A1B9A"}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
