import * as React from "react";

import { useLocation } from "react-router-dom";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ShopHeader from "../components/shop/ShopHeader";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ProductShowcase from "../../components/ProductShowcase";
import { useState } from "react";
import SimpleLoadingDisplay from "../../components/miscellaneous/SimpleLoadingDisplay";
import { useEffect } from "react";
import { getProductById } from "../../db/dbProduct";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { getPostById } from "../../db/dbPost";
import { useTheme } from "@emotion/react";
import ProductBriefDetail from "../../components/product/ProductBriefDetail";
import ProductFAQs from "../../components/product/ProductFAQs";
import RatingAndReview from "../../components/product/RatingDetailDisplay";
import RatingDetailDisplay from "../../components/product/RatingDetailDisplay";
import { ProductReview } from "../../components/product/ProductReview";
import ProductVideoReviews from "../../components/product/ProductVideoReviews";
import ProductNews from "../../components/product/ProductNews";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Topbar({ productId }) {
  return (
    <>
      <Box
        sx={{
          backgroundImage: "linear-gradient(#F41414, #D3C7C7)",
          display: "flex",
          justifyContent: "center",
          height: { xs: "70px", sm: "70px", md: "80px" },
          width: "100%",
        }}
      >
        {/* Left: logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "10%",
          }}
        >
          <ShopHeader />
        </Box>

        {/* Middle: title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
          }}
        >
          <Typography
            fontSize={24}
            align="center"
            alignContent={"center"}
            sx={{
              color: "white",
              fontWeight: "regular",
            }}
          >
            {"Preview " + productId}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

function ListLink({ productId }) {
  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        width="100%"
        sx={{
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          paddingLeft: "10px",
        }}
        separator="⟶"
      >
        <Link underline="hover" color="inherit" to="/dashboard">
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <HomeIcon color="primary" />
            Dashboard
          </Box>
        </Link>
        <Link underline="hover" color="inherit" to="/dashboard/products">
          products
        </Link>
        <Typography color="text.primary">{productId}</Typography>
      </Breadcrumbs>
    </>
  );
}

export function ProductPostDisplay({ postId }) {
  const { showSnackbar } = useSnackbarUtils();

  const [post, setPost] = useState(null);
  const [showFullPost, setShowFullPost] = useState(false); // New state

  useEffect(() => {
    getPostById(
      postId,
      (post) => {
        setPost(post);
      },
      (error) => {
        showSnackbar(error, "error");
      }
    );
  }, [postId]);

  const shortPost = post?.content.slice(0, 4000); // Shortened version of the post

  return (
    <>
      {post === null ? (
        <SimpleLoadingDisplay />
      ) : (
        <>
          <Box
            dangerouslySetInnerHTML={{
              __html: showFullPost ? post.content : shortPost,
            }}
            sx={{
              width: "100%",
              margin: "0 auto",
              whiteSpace: "pre-wrap",
              position: "relative",
              maxHeight: showFullPost ? "100%" : "690px",
              overflow: "hidden"
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: 80,
              marginTop: -5,
              background:
                "linear-gradient(45deg, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.1) 90%)",
            }}
            width="100%"
          >
            <Button
              style={{
                display: "block",
                margin: "0 auto",
                marginTop: "20px",
              }}
              variant="outlined"
              onClick={() => setShowFullPost(!showFullPost)}
            >
              {showFullPost ? "Show Less" : "Show More"}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

export default function PreviewProductPage() {
  let query = useQuery();
  const productId = query.get("productId");

  const [product, setProduct] = useState(null);

  /**
   * fetch product data from server
   */
  useEffect(() => {
    getProductById(productId, (product) => {
      setProduct(product);
    });
  }, [productId]);

  if (product === null) {
    return (
      <>
        <SimpleLoadingDisplay />
      </>
    );
  }

  return (
    <>
      <ThemeProvider theme={violet_theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Topbar */}
          <Topbar productId={productId} />
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
            <ListLink productId={productId} />
            <Divider
              sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
            />
            <ProductShowcase product={product} />
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
                  }}>
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
            <Divider
              sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
