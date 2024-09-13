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

export const MockProductCard = ({ product, selectingPart, activeEvent }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);



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
                    border:
                      selectingPart === DISPLAY_PARTS.TERTIARY
                        ? "2px solid green"
                        : "none",
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
                    border:
                      selectingPart === DISPLAY_PARTS.SECONDARY
                        ? "2px solid blue"
                        : "none",
                  }}
                />
              )}
              <CardContent sx={{ position: "relative", zIndex: 2 }}>
                {" "}
                {/* higher z-index */}
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  onClick={() => {
                    navigate(`/shopping/all-products/${product.id}`);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={activeEvent && { textDecoration: "line-through" }}
                >
                  {priceFormatter.format(Math.min(...product.finalPrices))} -{" "}
                  {priceFormatter.format(Math.max(...product.finalPrices))}
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
                
              >
                Buy Now
              </Button>
              <Button
                startIcon={<ShoppingCart />}
                variant="outlined"
                color="primary"
                
                size="small"
              >
                Add to cart
              </Button>
            </CardActions>
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
              color={"secondary"}
            >
              <Favorite /> 
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
                border:
                  selectingPart === DISPLAY_PARTS.PRIMARY
                    ? "2px solid red"
                    : "none",
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
    </ThemeProvider>
  );
};

export default MockProductCard;
