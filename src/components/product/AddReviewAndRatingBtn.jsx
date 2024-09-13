import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider } from "@emotion/react";
import { violet_theme } from "../../theme/AppThemes";
import {
  Box,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Rating,
  Select,
  Typography,
} from "@mui/material";
import ImgRating from "../../assets/images/bot/rating.png";
import StarIcon from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useDispatch, useSelector } from "react-redux";
import { Rating as RatingModel } from "../../models/Rating";
import { Review } from "../../models/Review";
import { addProductRatingIfNotRated } from "../../db/dbUser";
import { updateUser } from "../../store/actions/userAction";
import { addReview } from "../../db/dbReview";
import { updateProducer } from "../../db/dbProducer";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PRODUCT_REVIEW_TAGS = [
  "Good value",
  "Great quality",
  "I love it",
  "High resolution camera",
  "Good battery life",
  "Fast charging",
  "Gamming",
  "Good for work",
  "Good for study",
  "Good for entertainment",
  "Fidelity Graphics",
  "Cpu performance",
  "Ram performance",
  "Storage performance",
];

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function AddReviewAndRatingButton({ product }) {
  const [open, setOpen] = React.useState(false);
  const [overAllRatingScore, setOverAllRatingScore] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [tags, setTags] = React.useState([]);
  const [content, setContent] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const { showSnackbar } = useSnackbarUtils();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    if(!user){
      showSnackbar("Please sign in to leave a review", "error");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmitForm = () => {
    console.log(">>> check submit rating");
    console.log(overAllRatingScore);
    console.log(tags);
    console.log(content);
    console.log(selectedFiles);

    const ratingModel = new RatingModel();
    ratingModel.productId = product.id;
    ratingModel.score = overAllRatingScore;
    ratingModel.userId = user.id;
    ratingModel.isStaffRating = user.isStaff;

    let ratingId = "";

    // create new user data bz use is a redux state object
    const userData = { ...user };

    // Note: this buggy function is 4 hours of pain and suffering :))
    addProductRatingIfNotRated(
      userData,
      product,
      ratingModel.data(),
      async (rating) => {
        const updatedUserData = {
          ...userData,
          ratedProducts: [...userData.ratedProducts, product.id],
          ratings: [...userData.ratings, rating.id],
        };
        ratingId = rating.id;
        dispatch(updateUser(updatedUserData));
        showSnackbar("Rating added successfully", "success");

        const reviewModel = new Review();
        reviewModel.productId = product.id;
        reviewModel.userId = user.id;
        reviewModel.content = content;
        reviewModel.productOpinions = tags;
        reviewModel.ratingId = ratingId;
        reviewModel.score = overAllRatingScore;

        addReview(
          updatedUserData,
          reviewModel.data(),
          {
            ...product,
            ratings: [...product.ratings, rating.id],
          },
          selectedFiles,
          (review) => {
            const updatedUserData2 = {
              ...updatedUserData,
              reviews: [...updatedUserData.reviews, review.id],
              reviewedProducts: [
                ...updatedUserData.reviewedProducts,
                product.id,
              ],
            };
            dispatch(updateUser(updatedUserData2));
            // #TODO: update product locally in redux
            showSnackbar("Review added successfully", "success");
          },
          (error) => {
            showSnackbar(error, "error");
          }
        );
      },
      (error) => {
        // debugger;
        showSnackbar(error, "error");
      }
    );

    handleClose();
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Button variant="contained" onClick={handleClickOpen}>
        Leave a Review and Rating
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            background: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          <img src={ImgRating} alt="Rating" width="50" height="70" />
          Leave a review and a rating
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="primary">
            {product.name}
          </Typography>
          <DialogContentText>Overall rating</DialogContentText>
          <Box
            sx={{
              width: 200,
              display: "flex",
              alignItems: "center",
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            <Rating
              name="hover-feedback"
              value={overAllRatingScore}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setOverAllRatingScore(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
              sx={{
                width: "100%",
              }}
            />
            {overAllRatingScore !== null && (
              <Box sx={{ ml: 2 }}>
                {labels[hover !== -1 ? hover : overAllRatingScore]}
              </Box>
            )}
          </Box>

          <Typography variant="h6" color="primary">
            What do you think?
          </Typography>

          <TextField
            autoFocus
            required
            id="name"
            name="what do you think?"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            onChange={(event) => {
              setContent(event.target.value);
            }}
            value={content}
          />

          <Typography
            variant="h6"
            color="primary"
            marginTop={2}
            marginBottom={2}
          >
            Tags
          </Typography>

          <Select
            labelId="tag-multiple-checkbox-label"
            id="tag-multiple-checkbox"
            multiple
            value={tags}
            onChange={(event) => handleChange(event)}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 400,
            }}
          >
            {PRODUCT_REVIEW_TAGS.map((tag) => (
              <MenuItem key={tag} value={tag}>
                <Checkbox checked={tags.indexOf(tag) > -1} />
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
          </Select>

          <Typography
            variant="h6"
            color="primary"
            marginTop={2}
            marginBottom={2}
          >
            Attach images
          </Typography>

          <TextField
            id="images"
            name="images"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              multiple: true,
              accept: "image/*",
            }}
            onChange={(event) => {
              setSelectedFiles(event.target.files);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            sx={{ width: "40%", margin: "auto" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            sx={{ width: "40%", margin: "auto" }}
            onClick={handleSubmitForm}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
