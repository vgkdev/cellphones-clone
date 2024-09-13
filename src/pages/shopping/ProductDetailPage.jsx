import * as React from "react";

import {
  Box,
  Grid,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../../theme/AppThemes";
import CssBaseline from "@mui/material/CssBaseline";
import { Divider, Paper } from "@mui/material";
import ProductShowcase from "../../components/ProductShowcase";
import { ProductPostDisplay } from "../dashboard/PreviewProductPage";
import ProductFAQs from "../../components/product/ProductFAQs";
import RatingDetailDisplay from "../../components/product/RatingDetailDisplay";
import { ProductReview } from "../../components/product/ProductReview";
import ProductBriefDetail from "../../components/product/ProductBriefDetail";
import ProductNews from "../../components/product/ProductNews";
import ProductVideoReviews from "../../components/product/ProductVideoReviews";
import { useState } from "react";
import { PRODUCT_COLLECTION_PATH, getProductById } from "../../db/dbProduct";
import SimpleLoadingDisplay from "../../components/miscellaneous/SimpleLoadingDisplay";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import imgNotFound from "../../assets/images/notFound_1.png";
import ProductComments from "../../components/comments/ProductComments";
import { doc, onSnapshot } from "firebase/firestore";
import { PRODUCER_COLLECTION_PATH } from "../../db/dbProducer";
import { db } from "../../config/firebase";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { showSnackbar } = useSnackbarUtils();
  const [product, setProduct] = useState(null);
  const [productNotFound, setProductNotFound] = useState(false);
  const location = useLocation();

  /**
   * fetch product data from server
   */
  React.useEffect(() => {
    // getProductById(
    //   productId,
    //   (product) => {
    //     setProduct(product);
    //   },
    //   (error) => {
    //     console.error("Failed to get product", error);
    //     showSnackbar("Product Not Exist!", "error");
    //     setProductNotFound(true);
    //   }
    // );
    if (productId === "undefined" || productId === "null") {
      return;
    }
    const unsub = onSnapshot(
      doc(db, PRODUCT_COLLECTION_PATH, productId),
      (d) => {
        if (d.exists()) {
          setProduct(d.data());
        } else {
          showSnackbar("Product Not Exist!", "error");
          setProductNotFound(true);
        }
      }
    );
    return () => {
      unsub();
    };
  }, [productId]);

  if (productNotFound) {
    return (
      <ThemeProvider theme={violet_theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <img src={imgNotFound} alt="not found" width="400px" height="400px" />
          <Typography variant="h3" color="error">
            Product Not Found!
          </Typography>

          <Typography variant="h6" color={violet_theme.palette.primary.main}>
            The product you are looking for does not exist. Are you sure you
            have the correct product ID?
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (product === null) {
    return (
      <>
        <SimpleLoadingDisplay />
      </>
    );
  }

  return (
    <>
      <ThemeProvider
        theme={violet_theme}
        key={location.pathname + "-product-detail"}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: {
                xs: "100%",
                sm: "100%",
                md: "90%",
                lg: "80%",
                xl: "60%",
              },
              height: "100%",
            }}
          >
            <Divider
              sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
            />
            <ProductShowcase
              product={product}
              key={location.pathname + "-showcase"}
            />
            <Divider
              sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
            />
            {/* First product video */}
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "10px",
                m: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: {
                    xs: "220px", // minHeight for xs devices
                    sm: "440px", // minHeight for sm devices
                    md: "600px", // minHeight for md devices
                    lg: "800px", // minHeight for lg devices
                    xl: "960", // minHeight for xl devices
                  },
                  aspectRatio: "16/9",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: "10px",
                    color: "inherit",
                    fontWeight: "bold",
                  }}
                >
                  Product Video
                </Typography>
                {product.videos.length > 0 ? (
                  <iframe
                    allowFullScreen
                    width="100%"
                    height="100%"
                    title="Youtube player"
                    sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                    src={`https://youtube.com/embed/${product.videos[0]}?autoplay=0`}
                  ></iframe>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      marginTop: "10px",
                      color: "primary",
                      fontWeight: "bold",
                    }}
                  >
                    No video available
                  </Typography>
                )}
              </Box>
            </Paper>
            <Divider
              sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "start",
                justifyContent: "start",
                width: "100%",
              }}
            >
              {/* Left 80% */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "70%",
                  margin: "10px",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      marginTop: "10px",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    Post
                  </Typography>
                  {product.posts.length > 0 ? (
                    <ProductPostDisplay postId={product.posts[0]} />
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        marginTop: "10px",
                        color: "primary",
                        fontWeight: "bold",
                      }}
                    >
                      No post available
                    </Typography>
                  )}
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <ProductFAQs product={product} />
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <RatingDetailDisplay productId={productId} />
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <ProductReview productId={productId} />
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                    marginBottom={2}
                  >
                    {"Comments for " + product.name}
                  </Typography>

                  <ProductComments product={product} />
                </Paper>
              </Box>
              {/* Right 20% */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "start",
                  width: "30%",
                  margin: "10px",
                  // border: "1px solid lightgray",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      marginTop: "10px",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    Specs
                  </Typography>
                  <ProductBriefDetail product={product} />
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <ProductNews productId={productId} />
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <ProductVideoReviews productId={productId} />
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
