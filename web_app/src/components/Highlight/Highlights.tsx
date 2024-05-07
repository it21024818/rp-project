import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

const items = [
  {
    icon: <SettingsRoundedIcon />,
    title: "Customizable Options",
    description:
      "Tailor the extension to your needs with customizable settings, ensuring a personalized experience.",
  },
  {
    icon: <StarRoundedIcon />,
    title: "High Performance",
    description:
      "Experience top-notch performance with a robust system that handles tasks effortlessly.",
  },
  {
    icon: <LightbulbRoundedIcon />,
    title: "Innovative Features",
    description:
      "Stay ahead of the curve with innovative features that enhance your browsing experience.",
  },
  {
    icon: <PeopleRoundedIcon />,
    title: "Active Community",
    description:
      "Join a vibrant community of users and experts who contribute ideas and provide support.",
  },
  {
    icon: <SecurityRoundedIcon />,
    title: "Trusted Security",
    description:
      "Rest assured with robust security measures in place, ensuring your data and privacy are protected.",
  },
];

export default function ExtensionHighlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#06090a",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            Extension Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Explore why our extension stands out: customizable options, high
            performance, innovative features, active community, and trusted
            security.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "grey.800",
                  background: "transparent",
                  backgroundColor: "grey.900",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
