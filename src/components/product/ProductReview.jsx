import * as React from "react";

import { violet_theme } from "../../theme/AppThemes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../../store/actions/productsAction";
import { ThemeProvider } from "@emotion/react";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";
import { useSnackbar } from "notistack";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { REVIEW_COLLECTION, getReviewByProductId } from "../../db/dbReview";
import AddReviewAndRatingButton from "./AddReviewAndRatingBtn";
import { onSnapshot } from "firebase/firestore";
import ReviewWithRatingDisplay from "./ReviewWithRatingDisplay";
import botReviewImage from "../../assets/images/bot/message2.png";
import { Star } from "@mui/icons-material";

export const ProductReview = ({ productId }) => {
  const { showSnackbar } = useSnackbarUtils();

  const { products, loading, error } = useSelector((state) => state.products);
  const [product, setProduct] = React.useState(
    products !== null ? products.find((p) => p.id === productId) : null
  );
  const [reviews, setReviews] = React.useState([]);
  const [diplayingReviews, setDisplayingReviews] = React.useState([reviews]);
  const [filter, setFilter] = React.useState("all");
  const STARS_FILTER = ["1", "2", "3", "4", "5"];

  const dispatch = useDispatch();
  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    if (products === null) return;
    setProduct(products.find((p) => p.id === productId));
  }, [products, productId]);

  useEffect(() => {
    if (!product) return;

    const unsub = onSnapshot(REVIEW_COLLECTION, (docs) => {
      const reviews = [];
      docs.forEach((doc) => {
        const review = doc.data();
        if (review.productId === productId) {
          reviews.push(review);
        }
      });
      setReviews(reviews);
    });

    return unsub;
  }, [product]);

  useEffect(() => {
    let filteredReviews = reviews.filter((review) => {
      if (filter === "all") return true;
      if (filter.includes("image") && review.attachedImageUrls.length > 0)
        return true;
      if (filter.includes("purchased") && review.boughtProduct) return true;
      if (STARS_FILTER.some((star) => filter.includes(star))) {
        return filter.includes(Math.floor(review.score).toString());
      }
      return false;
    });
    setDisplayingReviews(filteredReviews);
  }, [filter, reviews, STARS_FILTER]);

  if (!product) return <SimpleLoadingDisplay />;

  return (
    <>
      <ThemeProvider theme={violet_theme}>
        <Box
          sx={(theme) => ({
            p: 3,
            borderRadius: 1,
          })}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6" color="primary">
            {"Review " + product.name}
          </Typography>

          <Typography
            variant="body1"
            color="primary"
            align="left"
            fontStyle="italic"
          >
            What do you think about this product?
          </Typography>

          <Box display="flex" justifyContent="center">
            <AddReviewAndRatingButton product={product} />
          </Box>

          <Divider sx={{ mt: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={botReviewImage} alt="bot review" />
          </Box>

          {/* Filter section */}
          <Typography
            variant="body1"
            color="primary"
            align="left"
            fontStyle="italic"
          >
            Filter reviews
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label="All"
              variant={filter === "all" ? "filled" : "outlined"}
              onClick={() => setFilter("all")}
              color="primary"
            />
            <Chip
              label="Attached Image"
              variant={filter.includes("image") ? "filled" : "outlined"}
              onClick={() => {
                if (!filter.includes("image")) {
                  setFilter(filter + " image");
                }
              }}
              onDelete={
                filter.includes("image")
                  ? () => setFilter(filter.replace(" image", ""))
                  : undefined
              }
              color="primary"
            />
            <Chip
              label="Purchased"
              variant={filter.includes("purchased") ? "filled" : "outlined"}
              onClick={() => {
                if (!filter.includes("purchased")) {
                  setFilter(filter + " purchased");
                }
              }}
              onDelete={
                filter.includes("purchased")
                  ? () => setFilter(filter.replace(" purchased", ""))
                  : undefined
              }
              color="primary"
            />
          </Stack>
          <Stack direction="row" spacing={1} marginTop={1}>
            {STARS_FILTER.map((star, index) => (
              <Chip
                key={"star-filter-" + index}
                label={star}
                variant={filter.includes(star) ? "filled" : "outlined"}
                sx={{ backgroundColor: "primary" }}
                avatar={<Star />}
                onClick={() => {
                  if (!filter.includes(star)) {
                    setFilter(filter + " " + star);
                  }
                }}
                onDelete={
                  filter.includes(star)
                    ? () => setFilter(filter.replace(" " + star, ""))
                    : undefined
                }
              />
            ))}
          </Stack>

          <Divider sx={{ mt: 2 }} />

          {reviews.length !== 0 ? (
            diplayingReviews.length !== 0 ? (
              diplayingReviews.map((review) => (
                <ReviewWithRatingDisplay key={review.id} review={review} />
              ))
            ) : (
              <Typography variant="body1" color="primary" align="center">
                No review match the filter
              </Typography>
            )
          ) : (
            <Typography variant="body1" color="primary" align="center">
              No review yet
            </Typography>
          )}
        </Box>
      </ThemeProvider>
    </>
  );
};
