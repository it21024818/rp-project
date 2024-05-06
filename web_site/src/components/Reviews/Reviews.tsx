import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";

const userReviews = [
  {
    avatar: <Avatar alt="Tharidu Gunasekara" src="/src/assets/tharindu.png" />,
    name: "Tharidu Gunasekara",
    occupation: "Senior Engineer",
    testimonial:
      "This extension is a game-changer! The trustworthiness score and visual indicators make it easy to spot misleading content, giving me peace of mind.",
  },
  {
    avatar: <Avatar alt="Dinuka Dissanayake" src="/src/assets/dinuka.jpeg" />,
    name: "Dinuka Dissanayake",
    occupation: "DevOps Engineer",
    testimonial:
      "Impressed by its intuitive design and customizable settings. The educational resources are a bonus – I've learned a lot about media literacy.",
  },
  {
    avatar: (
      <Avatar alt="Sansika Kodithuwakku" src="/src/assets/sansika.jpeg" />
    ),
    name: "Sansika Kodithuwakku",
    occupation: "Software Engineer",
    testimonial:
      "Real-time analysis is spot-on. This tool has made me a more informed internet user. Kudos to the developers!",
  },
  {
    avatar: <Avatar alt="Disira Thihan" src="/src/assets/disira.jpg" />,
    name: "Disira Thihan",
    occupation: "Software Engineer",
    testimonial:
      "A must-have for staying informed online. The visual indicators are a helpful reminder to evaluate content critically. Privacy is prioritized too!",
  },
];

export default function Reviews() {
  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Typography component="h2" variant="h4" color="text.primary">
          Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See what our customers love about our product. Discover how we excel
          in efficiency, durability, and satisfaction. Join us for quality,
          innovation, and reliable support.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userReviews.map((review, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                p: 1,
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {review.testimonial}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  pr: 2,
                }}
              >
                <CardHeader
                  avatar={review.avatar}
                  title={review.name}
                  subheader={review.occupation}
                />
                <Rating
                  sx={{ marginTop: "30px" }}
                  name="half-rating-read"
                  defaultValue={2.5}
                  precision={0.5}
                  readOnly
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
