import * as React from "react";

import { violet_theme } from "../../theme/AppThemes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../../store/actions/productsAction";
import { ThemeProvider } from "@emotion/react";
import { Box, Grid, LinearProgress, Rating, Typography } from "@mui/material";
import { useState } from "react";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";
import ProductRating from "./ProductRating";
import { asyncGetAverageRating, getAllRatings } from "../../db/dbRating";
import { getReviewByProductId } from "../../db/dbReview";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { Star } from "@mui/icons-material";
import { toTruncatedFirstDecimal } from "../../utils/stringHelper";

export default function RatingDetailDisplay({ productId }) {
  const { showSnackbar } = useSnackbarUtils();

  const { products, loading, error } = useSelector((state) => state.products);
  const [product, setProduct] = useState(
    products ? products.find((p) => p.id === productId) : null
  );
  const [ratings, setRatings] = useState(null);
  const [reviews, setReviews] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (products.length === 0) {
      debugger;
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    getReviewByProductId(
      product.id,
      (reviews) => {
        setReviews(reviews);
      },
      (error) => {
        showSnackbar(error, "warning", true);
      }
    );
  }, [productId]);

  useEffect(() => {
    setProduct(products.find((p) => p.id === productId));
  }, [products, productId]);

  useEffect(() => {
    getAllRatings(
      (ratings) => {
        const ratingsByProductId = ratings.filter(
          (rating) => rating.productId === productId
        );
        setRatings(ratingsByProductId);
      },
      (error) => {
        showSnackbar(error, "warning", true);
      }
    );
  }, [productId]);

  const getAverageRating = () => {
    if (!ratings) {
      return 0;
    }

    if (ratings.length === 0) {
      return 0;
    }

    let sum = 0;
    let count = 0;
    ratings.forEach((rating) => {
      if (rating.productId === productId) {
        sum += rating.score;
        count++;
      }
    });
    return count === 0 ? 0 : sum / count;
  };

  const ratingCountByScore = (score) => {
    let count = 0;
    ratings.forEach((rating) => {
      if (rating.score >= score && rating.score < score + 1) {
        count++;
      }
    });
    return count;
  };

  const ratingsValue = Array.from({ length: 5 }, (_, i) => 6 - (i + 1));

  console.log(">>> checking products", products);

  if (loading || !ratings || !reviews || !product) {
    return <SimpleLoadingDisplay />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const averageRating = getAverageRating();

  return (
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
          {"Rating " + product.name}
        </Typography>

        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
          {/* 40% */}
          <Grid item sx={{ width: "40%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // border: "1px solid grey",
                height: "100%",
              }}
            >
              <Rating
                name="read-only"
                value={averageRating}
                readOnly
                precision={0.5}
                size="small"
              />
              <Typography variant="p" color="primary">
                {"Average rating: " + averageRating
                  ? toTruncatedFirstDecimal(averageRating) + " / 5"
                  : "No rating"}
              </Typography>
              <Typography variant="p" color="blue">
                {reviews.length + " reviews "}
              </Typography>
            </Box>
          </Grid>

          {/* Vertical Line */}
          <Box sx={{ borderLeft: "1px solid grey", height: "auto", mx: 2 }} />

          {/* 60% */}
          <Grid item sx={{ width: "55%" }}>
            {/* Ratings types width progress bar */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ratingsValue.map((value) => (
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  key={value}
                >
                  <Grid item sx={{ width: "20%" }}>
                    <Typography variant="p" color="primary">
                      {value}
                    </Typography>
                    <Star sx={{ color: "orange", fontSize: "small" }} />
                  </Grid>
                  <Grid item sx={{ width: "50%" }}>
                    <LinearProgress
                      variant="determinate"
                      value={(ratingCountByScore(value) / ratings.length) * 100}
                    />
                  </Grid>
                  <Grid item sx={{ width: "30%" }}>
                    <Typography variant="p" color="black">
                      {ratingCountByScore(value) + " ratings "}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
