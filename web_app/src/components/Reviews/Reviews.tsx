import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

const userReviews = [
  {
    reaction: "GOOD",
    details: {
      message: "This was accurate",
      textQuality: false,
      sentiment: "POSITIVE",
      sarcasm: "GEN",
      bias: "LEFT",
      isFake: false,
    },
  },
];

export default function Reviews() {
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    reaction: "",
    details: {
      message: "",
      textQuality: false,
      sentiment: "",
      sarcasm: "",
      bias: "",
      isFake: false,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in newReview.details) {
      setNewReview({
        ...newReview,
        details: { ...newReview.details, [name]: value },
      });
    } else {
      setNewReview({ ...newReview, [name]: value });
    }
  };

  const handleSubmitReview = () => {
    userReviews.push(newReview);
    handleClose();
  };

  return (
    <Container
      sx={{
        pt: 4,
        pb: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Typography component="h2" variant="h4" color="text.primary">
        Reviews
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Review
      </Button>
      <Grid container spacing={2}>
        {userReviews.map((review, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Reaction: {review.reaction}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Message: {review.details.message}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sentiment: {review.details.sentiment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sarcasm: {review.details.sarcasm}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bias: {review.details.bias}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fake: {review.details.isFake ? "Yes" : "No"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Add Your Review
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            fullWidth
            margin="normal"
            label="Reaction"
            name="reaction"
            variant="outlined"
            value={newReview.reaction}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Message"
            name="message"
            variant="outlined"
            value={newReview.details.message}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sentiment"
            name="sentiment"
            variant="outlined"
            value={newReview.details.sentiment}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sarcasm"
            name="sarcasm"
            variant="outlined"
            value={newReview.details.sarcasm}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bias"
            name="bias"
            variant="outlined"
            value={newReview.details.bias}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Is Fake"
            name="isFake"
            variant="outlined"
            value={newReview.details.isFake ? "Yes" : "No"}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            sx={{ mt: 2 }}
            fullWidth
          >
            Submit Review
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
