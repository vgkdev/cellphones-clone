import React from "react";
import { Card, CardActions, CardContent, Grid, Skeleton } from "@mui/material";

const ProductsLoading = () => {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(3)).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card>
            <Skeleton variant="rectangular" width="100%" height={200} />
            <CardContent>
              <Skeleton />
              <Skeleton width="60%" />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={100} height={36} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductsLoading;
