import {
  Container,
  Typography,
  Button,
  Modal,
  TextField,
  Box,
  Stack,
  IconButton,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import { SelectChangeEvent } from "@mui/material";
import { useReviewsMutation } from "../../store/apiquery/reviewsApiSlice";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

const SentimentEnum = {
  NEGATIVE: "NEGATIVE",
  POSITIVE: "POSITIVE",
  NEUTRAL: "NEUTRAL",
};

const SarcasmEnum = {
  GENERIC: "GENERIC",
  RHETORICAL_QUESTION: "RHETORICAL_QUESTION",
  HYPERBOLE: "HYPERBOLE",
};

const PoliticalLeaningEnum = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  CENTER: "CENTER",
};

const ReactionEnum = {
  GOOD: "GOOD",
  BAD: "BAD",
};

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

interface ReviewsProps {
  id: string;
}

export default function Reviews({ id }: ReviewsProps) {
  const [makeFeedback] = useReviewsMutation();
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    reaction: "",
    details: {
      message: "",
      sentiment: "",
      sarcasm: "",
      bias: "",
      isFake: false,
    },
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;

    setNewReview((prevReview) => ({
      ...prevReview,
      details: {
        ...prevReview.details,
        [name]: value,
      },
    }));
  };

  const handleSubmitReview = async () => {
    try {
      const predictionId = id;
      await makeFeedback({ predictionId, formData: newReview }).unwrap();
      setAlertType("success");
      setAlertOpen(true);
      handleClose();
    } catch (err) {
      setAlertType("error");
      setAlertOpen(true);
      console.error("Error submitting review:", err);
    }
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      details: {
        ...prevReview.details,
        [name]: value,
      },
    }));
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
      <Typography variant="h5">Add a review</Typography>

      <Button
        variant="contained"
        sx={{ marginTop: "20px" }}
        color="primary"
        onClick={handleOpen}
      >
        Add Review
      </Button>

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
          >
            <Typography variant="h6">Add Your Review</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={{ color: "red", marginTop: "20px" }}>
                Good Or Bad
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <StyledRating
                sx={{ marginTop: "20px" }}
                name="reaction"
                value={newReview.reaction === ReactionEnum.GOOD ? 1 : 0}
                onChange={(event, newValue) => {
                  setNewReview({
                    ...newReview,
                    reaction:
                      newValue === 1 ? ReactionEnum.GOOD : ReactionEnum.BAD,
                  });
                }}
                precision={1}
                max={1}
                icon={<ThumbUpIcon />}
                emptyIcon={<ThumbUpOutlinedIcon />}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            margin="normal"
            label="Message"
            name="message"
            variant="outlined"
            value={newReview.details.message}
            onChange={handleTextFieldChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Sentiment</InputLabel>
            <Select
              name="sentiment"
              value={newReview.details.sentiment}
              onChange={handleInputChange}
            >
              <MenuItem value={SentimentEnum.NEGATIVE}>Negative</MenuItem>
              <MenuItem value={SentimentEnum.POSITIVE}>Positive</MenuItem>
              <MenuItem value={SentimentEnum.NEUTRAL}>Neutral</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sarcasm</InputLabel>
            <Select
              name="sarcasm"
              value={newReview.details.sarcasm}
              onChange={handleInputChange}
            >
              <MenuItem value={SarcasmEnum.GENERIC}>Generic</MenuItem>
              <MenuItem value={SarcasmEnum.RHETORICAL_QUESTION}>
                Rhetorical Question
              </MenuItem>
              <MenuItem value={SarcasmEnum.HYPERBOLE}>Hyperbole</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Bias</InputLabel>
            <Select
              name="bias"
              value={newReview.details.bias}
              onChange={handleInputChange}
            >
              <MenuItem value={PoliticalLeaningEnum.LEFT}>Left</MenuItem>
              <MenuItem value={PoliticalLeaningEnum.CENTER}>Center</MenuItem>
              <MenuItem value={PoliticalLeaningEnum.RIGHT}>Right</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            sx={{ mt: 2 }}
          >
            Submit Review
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for success/error alerts */}
      <Snackbar
        open={alertOpen}
        onClose={handleAlertClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alertType} onClose={handleAlertClose}>
          {alertType === "success"
            ? "Review added successfully!"
            : "Failed to add review."}
        </Alert>
      </Snackbar>
    </Container>
  );
}
