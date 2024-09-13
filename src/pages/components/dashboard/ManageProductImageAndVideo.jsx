import * as React from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { useState, useEffect } from "react";

import { useSnackbar } from "notistack";

import {
  DeleteOutline,
  Refresh,
  SaveOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import { toSimpleDateString } from "../../../utils/date";
import PlusIcon from "@mui/icons-material/Add";
import { Stock } from "../../../models/Stock";
import {
  addProductImage,
  addProductVideo,
  deleteProductDisplayImageUrl,
  deleteProductImage,
  deleteProductVideo,
  getProductById,
  setProductImage,
  updateProduct,
} from "../../../db/dbProduct";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { getImageNameThroughUrl } from "../../../utils/stringHelper";

export default function ManageProductImageAndVideo({ productId }) {
  const [product, setProduct] = useState(null);
  const [shouldOpenVideoPlayer, setShouldOpenVideoPlayer] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [inpVideoId, setInpVideoId] = useState("");

  //utils
  const { showSnackbar } = useSnackbarUtils();

  // handlers
  const handleAddProductImage = () => {
    // open file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.click();
    input.onchange = (e) => {
      const files = e.target.files;
      console.log(files);
      for (let i = 0; i < files.length; i++) {
        addProductImage(
          product,
          files[i],
          (returnProduct) => {
            console.log("Image added");
            console.log(returnProduct);
            showSnackbar("Image added", "success");
            setProduct({
              ...product,
              imageUrls: returnProduct.imageUrls,
              imageNames: returnProduct.imageNames,
            });
          },
          (error) => {
            showSnackbar("Error adding image: %s" + error, "error");
            console.error(error);
          }
        );
      }
    };
  };

  const handleDeleteProductImage = (index) => {
    deleteProductImage(
      product,
      index,
      (returnProduct) => {
        console.log("Image deleted");
        console.log(returnProduct);
        showSnackbar("Image deleted", "success");
        setProduct({
          ...product,
          imageUrls: returnProduct.imageUrls,
          imageNames: returnProduct.imageNames,
        });
      },
      (error) => {
        console.error(error);
        showSnackbar("Error deleting image", "error");
      }
    );
  };

  const handleClickOpenVideoId = (url) => {
    setVideoId(url);
    setShouldOpenVideoPlayer(true);
  };

  const handleCloseVideo = () => {
    setShouldOpenVideoPlayer(false);
  };

  const handleSetProductImage = () => {
    // open file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (e) => {
      const files = e.target.files;
      console.log(files);
      if (files.length === 0) {
        return;
      } else if (files.length > 1) {
        showSnackbar("Please select only one image", "error");
        return;
      }
      setProductImage(
        product,
        files[0],
        (returnProduct) => {
          console.log("Image set");
          console.log(returnProduct);
          showSnackbar("Image set", "success");
          setProduct({
            ...product,
            displayImageUrl: returnProduct.displayImageUrl,
          });
        },
        (error) => {
          showSnackbar("Error setting image: %s" + error, "error");
          console.error(error);
        }
      );
    };
  };

  const handleDeleteProductDisplayImageUrl = () => {
    deleteProductDisplayImageUrl(
      product,
      (returnProduct) => {
        console.log("Display image deleted");
        console.log(returnProduct);
        showSnackbar("Display image deleted", "success");
        setProduct({
          ...product,
          displayImageUrl: returnProduct.displayImageUrl,
        });
      },
      (error) => {
        showSnackbar("Error deleting display image", "error");
        console.error(error);
      }
    );
  };

  const handleAddProductVideo = () => {
    if (inpVideoId === "") {
      return;
    }

    addProductVideo(
      product,
      inpVideoId,
      (returnProduct) => {
        console.log("Video added");
        console.log(returnProduct);
        showSnackbar("Video added", "success");
        setProduct({
          ...product,
          videos: returnProduct.videos,
        });
      },
      (error) => {
        showSnackbar("Error adding video: %s" + error, "error");
        console.error(error);
      }
    );
  };

  const handleDeleteProductVideo = (videoId) => {
    deleteProductVideo(
      product,
      videoId,
      (returnProduct) => {
        console.log("Video deleted");
        console.log(returnProduct);
        showSnackbar("Video deleted", "success");
        setProduct({
          ...product,
          videos: returnProduct.videos,
        });
      },
      (error) => {
        showSnackbar("Error deleting video", "error");
        console.error(error);
      }
    );
  };

  const [hasErrorWhenFetchingProduct, setHasErrorWhenFetchingProduct] =
    useState(false);

  useEffect(() => {
    getProductById(
      productId,
      (product) => {
        console.log("Product: ", product);
        setProduct(product);
      },
      (error) => {
        console.error("Error getting product: ", error);
        if (hasErrorWhenFetchingProduct === false) {
          setHasErrorWhenFetchingProduct(true);
        }
      }
    );
  }, [productId, hasErrorWhenFetchingProduct]);

  if (product === null) {
    // spinner
    return (
      <>
        {hasErrorWhenFetchingProduct ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <SentimentDissatisfiedOutlined />
            <p>Error fetching product</p>
            <Button
              onClick={(e) => {
                setHasErrorWhenFetchingProduct(false);
                getProductById(
                  productId,
                  (product) => {
                    console.log("Product: ", product);
                    setProduct(product);
                  },
                  (error) => {
                    console.error("Error getting product: ", error);
                    if (hasErrorWhenFetchingProduct === false) {
                      setHasErrorWhenFetchingProduct(true);
                    }
                  }
                );
              }}
              variant="outlined"
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Grid>
            <p>Loading ...</p>
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </Grid>
        )}
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Product displayImageUrl */}
        <Typography variant="h6">Display Image</Typography>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid
              spacing={2}
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
            >
              <Grid item>
                <Tooltip
                  title={
                    <img
                      src={product.displayImageUrl}
                      style={{ width: "100px", height: "auto" }}
                      alt="Preview"
                    />
                  }
                >
                  <Chip
                    label={getImageNameThroughUrl(product.displayImageUrl)}
                    variant="outlined"
                    onDelete={(e) => {
                      handleDeleteProductDisplayImageUrl();
                    }}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<PlusIcon />}
            onClick={(e) => {
              handleSetProductImage();
            }}
          >
            Set new
          </Button>
        </Box>
        <Typography variant="h6">Images</Typography>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid
              spacing={2}
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
            >
              {product.imageUrls.map((url, index) => {
                return (
                  <Grid item key={"product-image-preview-" + url}>
                    <Tooltip
                      title={
                        <img
                          src={url}
                          style={{ width: "100px", height: "auto" }}
                          alt="Preview"
                        />
                      }
                    >
                      <Chip
                        label={product.imageNames[index]}
                        variant="outlined"
                        onDelete={(e) => {
                          handleDeleteProductImage(index);
                        }}
                      />
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<PlusIcon />}
            onClick={(e) => {
              handleAddProductImage();
            }}
          >
            Add new
          </Button>
          {/* <Button
            variant="outlined"
            startIcon={<SaveOutlined />}
            onClick={(e) => {
              console.log("Save clicked");
            }}
          >
            Save
          </Button> */}
        </Box>

        <Typography variant="h6">Videos</Typography>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid
              spacing={2}
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
            >
              {product.videos.map((ytVideoId, index) => {
                return (
                  <Grid item key={"product-video-preview-" + ytVideoId}>
                    <Tooltip
                      title={
                        <iframe
                          title="Youtube player"
                          src={`https://youtube.com/embed/${ytVideoId}?autoplay=0`}
                        ></iframe>
                      }
                    >
                      <Chip
                        label={ytVideoId}
                        variant="outlined"
                        onDelete={(e) => {
                          handleDeleteProductVideo(ytVideoId);
                        }}
                        onClick={() => handleClickOpenVideoId(ytVideoId)}
                      />
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "10px",
          }}
        >
          <TextField
            label="Youtube video ID"
            value={inpVideoId}
            onChange={(e) => {
              setInpVideoId(e.target.value);
            }}
            required
            fullWidth
          />
          <Button
            variant="outlined"
            startIcon={<PlusIcon />}
            onClick={(e) => {
              handleAddProductVideo();
            }}
          >
            Add
          </Button>
          {/* <Button
            variant="outlined"
            startIcon={<SaveOutlined />}
            onClick={(e) => {
              console.log("Save clicked");
            }}
          >
            Save
          </Button> */}
        </Box>
      </Box>

      <Dialog
        open={shouldOpenVideoPlayer}
        onClose={handleCloseVideo}
        maxWidth="lg"
        fullWidth={true}
      >
        <iframe
          allowFullScreen
          width="100%"
          height={window.innerHeight * 0.8}
          title="Youtube player"
          sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
          src={`https://youtube.com/embed/${videoId}?autoplay=0`}
        ></iframe>
      </Dialog>
    </>
  );
}
