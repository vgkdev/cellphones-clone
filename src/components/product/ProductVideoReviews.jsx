import * as React from "react";

import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@emotion/react";
import { Box, Divider, Typography } from "@mui/material";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";
import { getAllPostsByProductId, getPostById } from "../../db/dbPost";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/actions/productsAction";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

export default function ProductVideoReviews({ productId }) {
  const { showSnackbar } = useSnackbarUtils();
  const { products, loading, error } = useSelector((state) => state.products);
  const [product, setProduct] = React.useState(null);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  React.useEffect(() => {
    setProduct(products.find((p) => p.id === productId));
  }, [products, productId]);

  if (loading || !product) {
    return <SimpleLoadingDisplay />;
  }

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
          <VideoLibraryIcon />
          <Typography variant="h7" align="center">
            Videos About {product.name}
          </Typography>
        </Box>
        <Divider />

        {product.videos.map((videoId) => {
          return (
            <Box
              key={videoId}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.whiteGray,
              }}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <iframe
                height="100"
                width="160"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Divider />
            </Box>
          );
        })}
      </Box>
    </ThemeProvider>
  );
}
