// import {
//   Container,
//   Typography,
//   Button,
//   Modal,
//   TextField,
//   Box,
//   Stack,
//   IconButton,
//   Alert,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Grid,
//   Snackbar,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useState } from "react";
// import { styled } from "@mui/material/styles";
// import Rating from "@mui/material/Rating";
// import { SelectChangeEvent } from "@mui/material";
// import { useReviewsMutation } from "../../store/apiquery/reviewsApiSlice";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

// const SentimentEnum = {
//   NEGATIVE: "NEGATIVE",
//   POSITIVE: "POSITIVE",
//   NEUTRAL: "NEUTRAL",
// };

// const SarcasmEnum = {
//   GENERIC: "GENERIC",
//   RHETORICAL_QUESTION: "RHETORICAL_QUESTION",
//   HYPERBOLE: "HYPERBOLE",
// };

// const PoliticalLeaningEnum = {
//   LEFT: "LEFT",
//   RIGHT: "RIGHT",
//   CENTER: "CENTER",
// };

// const ReactionEnum = {
//   GOOD: "GOOD",
//   BAD: "BAD",
// };

// const StyledRating = styled(Rating)({
//   "& .MuiRating-iconFilled": {
//     color: "#ff6d75",
//   },
//   "& .MuiRating-iconHover": {
//     color: "#ff3d47",
//   },
// });

// interface ReviewsProps {
//   id: string;
// }

// export default function Reviews({ id }: ReviewsProps) {
//   const [makeFeedback] = useReviewsMutation();
//   const [open, setOpen] = useState(false);
//   const [newReview, setNewReview] = useState({
//     reaction: "",
//     details: {
//       message: "",
//       sentiment: "",
//       sarcasm: "",
//       bias: "",
//       isFake: false,
//     },
//   });
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertType, setAlertType] = useState<"success" | "error">("success");

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
//   ) => {
//     const { name, value } = event.target;

//     setNewReview((prevReview) => ({
//       ...prevReview,
//       details: {
//         ...prevReview.details,
//         [name]: value,
//       },
//     }));
//   };

//   const handleSubmitReview = async () => {
//     try {
//       const predictionId = id;
//       await makeFeedback({ predictionId, formData: newReview }).unwrap();
//       setAlertType("success");
//       setAlertOpen(true);
//       handleClose();
//     } catch (err) {
//       setAlertType("error");
//       setAlertOpen(true);
//       console.error("Error submitting review:", err);
//     }
//   };

//   const handleTextFieldChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = event.target;
//     setNewReview((prevReview) => ({
//       ...prevReview,
//       details: {
//         ...prevReview.details,
//         [name]: value,
//       },
//     }));
//   };

//   const handleAlertClose = () => {
//     setAlertOpen(false);
//   };

//   return (
//     <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
//       <Typography variant="h5">Add a review</Typography>

//       <Button
//         variant="contained"
//         sx={{ marginTop: "20px" }}
//         color="primary"
//         onClick={handleOpen}
//       >
//         Add Review
//       </Button>

//       <Modal open={open} onClose={handleClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             p: 4,
//           }}
//         >
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h6">Add Your Review</Typography>
//             <IconButton onClick={handleClose}>
//               <CloseIcon />
//             </IconButton>
//           </Stack>
//           <Grid container spacing={2}>
//             <Grid item xs={8}>
//               <Typography sx={{ color: "red", marginTop: "20px" }}>
//                 Good Or Bad
//               </Typography>
//             </Grid>
//             <Grid item xs={4}>
//               <StyledRating
//                 sx={{ marginTop: "20px" }}
//                 name="reaction"
//                 value={newReview.reaction === ReactionEnum.GOOD ? 1 : 0}
//                 onChange={(_event, newValue) => {
//                   setNewReview({
//                     ...newReview,
//                     reaction:
//                       newValue === 1 ? ReactionEnum.GOOD : ReactionEnum.BAD,
//                   });
//                 }}
//                 precision={1}
//                 max={1}
//                 icon={<ThumbUpIcon />}
//                 emptyIcon={<ThumbUpOutlinedIcon />}
//               />
//             </Grid>
//           </Grid>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Message"
//             name="message"
//             variant="outlined"
//             value={newReview.details.message}
//             onChange={handleTextFieldChange}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Sentiment</InputLabel>
//             <Select
//               name="sentiment"
//               value={newReview.details.sentiment}
//               onChange={handleInputChange}
//             >
//               <MenuItem value={SentimentEnum.NEGATIVE}>Negative</MenuItem>
//               <MenuItem value={SentimentEnum.POSITIVE}>Positive</MenuItem>
//               <MenuItem value={SentimentEnum.NEUTRAL}>Neutral</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Sarcasm</InputLabel>
//             <Select
//               name="sarcasm"
//               value={newReview.details.sarcasm}
//               onChange={handleInputChange}
//             >
//               <MenuItem value={SarcasmEnum.GENERIC}>Generic</MenuItem>
//               <MenuItem value={SarcasmEnum.RHETORICAL_QUESTION}>
//                 Rhetorical Question
//               </MenuItem>
//               <MenuItem value={SarcasmEnum.HYPERBOLE}>Hyperbole</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Bias</InputLabel>
//             <Select
//               name="bias"
//               value={newReview.details.bias}
//               onChange={handleInputChange}
//             >
//               <MenuItem value={PoliticalLeaningEnum.LEFT}>Left</MenuItem>
//               <MenuItem value={PoliticalLeaningEnum.CENTER}>Center</MenuItem>
//               <MenuItem value={PoliticalLeaningEnum.RIGHT}>Right</MenuItem>
//             </Select>
//           </FormControl>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSubmitReview}
//             sx={{ mt: 2 }}
//           >
//             Submit Review
//           </Button>
//         </Box>
//       </Modal>

//       {/* Snackbar for success/error alerts */}
//       <Snackbar
//         open={alertOpen}
//         onClose={handleAlertClose}
//         autoHideDuration={5000}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert severity={alertType} onClose={handleAlertClose}>
//           {alertType === "success"
//             ? "Review added successfully!"
//             : "Failed to add review."}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// }
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

import RateReviewIcon from "@mui/icons-material/RateReview";

const GradientButton = styled(Button)({
  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
  border: 0,
  borderRadius: 30,
  boxShadow: "0 3px 5px 2px rgba(25, 118, 210, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  textTransform: "none",
  fontSize: "16px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
    transform: "scale(1.05)",
  },
});

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#4caf50",
  },
  "& .MuiRating-iconHover": {
    color: "#388e3c",
  },
  display: "flex",
  alignItems: "center",
});

const CustomButton = styled(Button)({
  backgroundColor: "#1976d2",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
  transition: "all 0.3s ease",
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
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          letterSpacing: "0.5px",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        Add a Review
      </Typography>

      <Typography
        variant="body1"
        sx={{
          marginTop: "15px",
          color: "#424242",
          lineHeight: "1.5",
          maxWidth: "600px", // Widened for a better flow of text
          margin: "auto",
          textAlign: "center", // Center the text
          fontSize: "15px", // Slightly larger font for better readability
          background: "linear-gradient(45deg, #405D72, #758694)", // Subtle gradient text color
          WebkitBackgroundClip: "text", // Required for gradient text effect
          WebkitTextFillColor: "transparent", // Make the text itself transparent to show the gradient
          letterSpacing: "0.5px", // Add subtle letter spacing
          fontWeight: 500, // Semi-bold for emphasis
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", // Light shadow for depth
        }}
      >
        If you're satisfied with the fake news prediction and want to share your
        feedback, feel free to leave a review below. Your input helps us
        improve!
      </Typography>

      <GradientButton
        startIcon={<RateReviewIcon />}
        onClick={handleOpen}
        sx={{ marginTop: "30px" }}
      >
        Add Review
      </GradientButton>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: "10px",
            p: 4,
            boxShadow: 24,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Add Your Review
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Typography sx={{ fontWeight: "bold", marginTop: "20px" }}>
                Good or Bad
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <StyledRating
                name="reaction"
                value={newReview.reaction === ReactionEnum.GOOD ? 1 : 0}
                onChange={(_event, newValue) => {
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
            multiline
            rows={3}
            sx={{ marginTop: "20px" }}
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
          <CustomButton
            variant="contained"
            onClick={handleSubmitReview}
            sx={{ mt: 3, width: "100%" }}
          >
            Submit Review
          </CustomButton>
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
