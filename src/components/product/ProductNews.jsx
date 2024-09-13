import * as React from "react";

import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@emotion/react";
import { Box, Divider, Grid, Typography, colors } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { useEffect } from "react";
import { getAllPostsByProduct } from "../../db/dbPost";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/actions/productsAction";

export default function ProductNews({ productId }) {
  const { showSnackbar } = useSnackbarUtils();
  const [posts, setPosts] = React.useState([]);
  const [product, setProduct] = React.useState(null);
  const { products, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    setProduct(products.find((p) => p.id === productId));
  }, [products, productId]);

  useEffect(() => {
    if (!product) {
      return;
    }
    getAllPostsByProduct(
      product,
      (posts) => {
        setPosts(posts);
      },
      (error) => {
        showSnackbar(error, "error");
      }
    );
  }, [product]);

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={(theme) => ({
          p: 3,
          borderRadius: 1,
          // border: 1,
          justifyContent: "center",
          alignItems: "center",
          maxHeight: {
            xs: "300px",
            sm: "500px",
            md: "800px",
            lg: "1000px",
          },
          overflow: "auto",
        })}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            flexDirection: "row",
            mb: 2,
            color: "primary.main",
            gap: 1,
          }}
        >
          <NewspaperIcon />
          <Typography variant="h7" align="center">
            Product News About {product?.name}
          </Typography>
        </Box>

        <Divider />

        {posts?.length > 0 ? (
          posts.map((post) => (
            <Box
              key={post.id}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 1,
                backgroundColor: colors.grey[100],
              }}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    component="a"
                    variant="h6"
                    color="primary"
                    href={`/shopping/view-post?post=${post.id}`}
                    onClick={() => {
                      console.log("Link clicked!");
                    }}
                    sx={{
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {post.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{post.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption">
                    {new Date(post.lastUpdate).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography variant="body1" align="center">
            No posts available
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}
