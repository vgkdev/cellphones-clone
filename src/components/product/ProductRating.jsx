import * as React from "react";

import { RATING_COLLECTION, asyncGetAverageRating } from "../../db/dbRating";
import { useState } from "react";
import { useEffect } from "react";
import { Rating, Typography } from "@mui/material";
import { onSnapshot } from "firebase/firestore";

export default function ProductRating({ productId, size = "small" }) {
  const [averageRating, setAverageRating] = useState(null);

  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    const totalRating = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return totalRating / ratings.length;
  };

  useEffect(() => {
    const unsubcribe = onSnapshot(RATING_COLLECTION, (snapshot) => {
      const ratings = snapshot.docs.map((doc) => doc.data());
      const ratingsByProductId = ratings.filter(
        (rating) => rating.productId === productId
      );

      setAverageRating(getAverageRating(ratingsByProductId));
    });
    return unsubcribe;
  }, [productId]);

  return (
    <>
      {!isNaN(averageRating) ? (
        <Rating
          name="read-only"
          value={averageRating}
          readOnly
          precision={0.5}
          size={size}
        />
      ) : (
        <Typography variant="h6" color="error">
          No rating available
        </Typography>
      )}
    </>
  );
}
