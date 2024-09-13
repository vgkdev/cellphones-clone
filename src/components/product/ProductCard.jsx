import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { priceFormatter } from "../../utils/stringHelper";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { updateUserToFirebase } from "../../store/actions/userAction";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { updateProduct } from "../../store/actions/productsAction";
import { useNavigate } from "react-router-dom";
import Popper from "@mui/material/Popper";
import ProductBriefDetail from "./ProductBriefDetail";
import InfoIcon from "@mui/icons-material/Info";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../../theme/AppThemes";
import VariantStockModal from "../miscellaneous/VariantStockModal";
import ShowDialog from "../miscellaneous/ShowDialog";
import successGif from "../../assets/animations/success.gif";
import { getEventById } from "../../db/dbEvent";
import { DISPLAY_PARTS } from "../../models/Event";

export const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const { showSnackbar } = useSnackbarUtils();

  // const handleMouseEnter = (event) => {
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   setAnchorEl({
  //     clientHeight: 0,
  //     clientWidth: 0,
  //     getBoundingClientRect: () => ({
  //       top: event.clientY,
  //       left: event.clientX,
  //       right: event.clientX,
  //       bottom: event.clientY,
  //       width: 0,
  //       height: 0,
  //     }),
  //   });
  //   setOpen(true);
  // };

  // const handleMouseMove = (event) => {
  //   // Calculate the offset for the Popper
  //   const offsetX = event.clientX + 400 > window.innerWidth ? -350 : 350;
  //   const offsetY = event.clientY + 400 > window.innerHeight ? -350 : 350;

  //   setAnchorEl({
  //     clientHeight: 0,
  //     clientWidth: 0,
  //     getBoundingClientRect: () => ({
  //       top: event.clientY,
  //       left: event.clientX,
  //       right: event.clientX,
  //       bottom: event.clientY,
  //       width: 0,
  //       height: 0,
  //     }),
  //   });
  // };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  useEffect(() => {
    if (user?.likedProducts?.includes(product.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [product.id, user]);

  const handleLikeClick = () => {
    if (!user) {
      showSnackbar("Please sign in to like the product", "warning");
      return;
    }

    const updatedLikedProducts = liked
      ? user.likedProducts.filter((id) => id !== product.id)
      : [...user.likedProducts, product.id];

    const updatedUser = { ...user, likedProducts: updatedLikedProducts };
    const incrementBy = liked ? -1 : 1;

    dispatch(
      updateUserToFirebase(
        updatedUser,
        () => {
          setLiked(!liked);
          const updatedProduct = {
            ...product,
            likeCount: product.likeCount + incrementBy,
          };
          dispatch(
            updateProduct(
              updatedProduct,
              product.id,
              () => {
                showSnackbar(
                  liked
                    ? "You have unliked the product"
                    : "You have liked the product",
                  "success"
                );
              },
              (error) => {
                console.error("Error updating product like count: ", error);
                showSnackbar("Failed to update product like count", "error");
              }
            )
          );
        },
        (error) => {
          console.error("Error updating liked products: ", error);
          showSnackbar("Failed to update liked status of the product", "error");
        }
      )
    );
  };

  const handleOpenModal = (type) => {
    setActionType(type);
    setModalOpen(true);
  };

  useEffect(() => {
    if (product.activeEvent === "" || product.activeEvent === undefined) return;

    getEventById(
      product.activeEvent,
      (event) => {
        console.log("Event: ", event);
        setActiveEvent(event);
      },
      (error) => {
        console.error("Error getting event: ", error);
        showSnackbar("Failed to get event", "error");
      }
    );
  }, [product.activeEvent, product.id]);

  return (
    <ThemeProvider theme={violet_theme}>
      <Paper elevation={3} sx={{ width: 270, position: "relative" }}>
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <Card
            sx={{
              width: 250,
              position: "relative",
              m: 2,
              border: 0,
              boxShadow: 0,
            }}
          >
            <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="200"
                image={product.displayImageUrl}
                alt={product.name}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/shopping/all-products/${product.id}`);
                }}
              />

              {activeEvent && activeEvent.tertiaryDisplayPart !== "" && (
                <img
                  src={activeEvent.tertiaryDisplayPart}
                  alt={product.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    filter: "brightness(150%)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/shopping/all-products/${product.id}`);
                  }}
                />
              )}
            </Box>
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              {activeEvent && activeEvent.secondaryDisplayPart !== "" && (
                <img
                  src={activeEvent.secondaryDisplayPart}
                  alt={product.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    filter: "brightness(150%)",
                    zIndex: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/shopping/all-products/${product.id}`);
                  }}
                />
              )}
              <CardContent sx={{ position: "relative", zIndex: 2 }}>
                {" "}
                {/* higher z-index */}
                <Typography
                  gutterBottom
                  // variant="h6"
                  component="div"
                  onClick={() => {
                    navigate(`/shopping/all-products/${product.id}`);
                  }}
                  sx={{
                    cursor: "pointer",
                    fontSize: "medium",
                    fontWeight: "bold",
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={activeEvent && { textDecoration: "line-through" }}
                >
                  {priceFormatter.format(Math.min(...product.variantPrice))} -{" "}
                  {priceFormatter.format(Math.max(...product.variantPrice))}
                </Typography>
                {activeEvent && activeEvent.name !== "" && (
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight={"bold"}
                  >
                    {priceFormatter.format(
                      Math.min(...product.finalPrices)
                    )}{" "}
                    -{" "}
                    {priceFormatter.format(
                      Math.max(...product.finalPrices)
                    )}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Likes: {product.likeCount}
                </Typography>
              </CardContent>
            </Box>

            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal("buyNow")}
              >
                Buy Now
              </Button>
              <Button
                startIcon={<ShoppingCart />}
                variant="outlined"
                color="primary"
                onClick={() => handleOpenModal("addToCart")}
                size="small"
              >
                Add to cart
              </Button>
            </CardActions>
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
              color={liked ? "secondary" : "default"}
              onClick={handleLikeClick}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "primary",
                zIndex: 2,
              }}
              onClick={(event) => {
                setOpen(!open);
                setAnchorEl(event.currentTarget);
              }}
            >
              <InfoIcon color="black" />
            </IconButton>
          </Card>
          {activeEvent && activeEvent.primaryDisplayPart !== "" && (
            <img
              src={activeEvent.primaryDisplayPart}
              alt={product.name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                filter: "brightness(150%)",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/shopping/all-products/${product.id}`);
              }}
            />
          )}
        </Box>
      </Paper>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="right"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={handleMouseLeave}
        sx={{
          zIndex: 4,
        }}
      >
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderStyle: "solid",
            padding: 1,
            backgroundColor: "background.paper",
            maxHeight: 400,
            overflow: "auto",
            maxWidth: 400,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {product.name}
          </Typography>

          <img
            src={product.displayImageUrl}
            alt={product.name}
            style={{ width: 100, height: 100 }}
          />

          <ProductBriefDetail
            product={product}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Box>
      </Popper>
      <VariantStockModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        product={product}
        actionType={actionType}
        handleShowDialog={() => setDialogOpen(true)}
        handleCloseDialog={() => setDialogOpen(false)}
      />

      <ShowDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        message="Prodcut added to cart"
        gifUrl={successGif}
        duration={1000}
      />
    </ThemeProvider>
  );
};

export default ProductCard;
