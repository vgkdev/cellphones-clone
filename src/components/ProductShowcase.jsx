import {
  Box,
  Button,
  Divider,
  Icon,
  Paper,
  Skeleton,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import ProductRating from "./product/ProductRating";
import { useState } from "react";
import { useEffect } from "react";
import { getReviewByProductId } from "../db/dbReview";
import { useSnackbarUtils } from "../utils/useSnackbarUtils";
import SimpleImageCarousel from "./miscellaneous/SimpleImageCarousel";
import { getAllProductStocks } from "../db/dbStock";
import { priceFormatter } from "../utils/stringHelper";
import {
  LocalShipping,
  PlusOneOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import ChipWithTitle from "./miscellaneous/ChipWithTitle";
import DeveloperBoardRoundedIcon from "@mui/icons-material/DeveloperBoardRounded";
import ScreenshotIcon from "@mui/icons-material/Screenshot";
import MemoryTwoToneIcon from "@mui/icons-material/MemoryTwoTone";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import FlipCameraIosRoundedIcon from "@mui/icons-material/FlipCameraIosRounded";
import Battery5BarRoundedIcon from "@mui/icons-material/Battery5BarRounded";
import ExpandableText from "./miscellaneous/ExpandableTexrt";
import Shop2Icon from "@mui/icons-material/Shop2";
import ChipWithTitleV2 from "./miscellaneous/ChipWithTitleVer2";
import GiteIcon from "@mui/icons-material/Gite";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addItemToCart } from "../db/dbCart";
import { violet_theme } from "../theme/AppThemes";
import ShowDialog from "./miscellaneous/ShowDialog";
import successGif from "../assets/animations/success.gif";
import { PRODUCT_TYPES } from "../models/Product";

export function VariantButton({
  variantName,
  variantIndex,
  isSelected,
  variantPrice,
  onClick,
}) {
  return (
    <>
      <Button
        onClick={onClick}
        variant={isSelected ? "contained" : "outlined"}
        color="primary"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: { sm: "200px", lg: "240px", xl: "250px" },
          }}
        >
          <Typography variant="p">{variantName[variantIndex]}</Typography>
          <Typography variant="p" sx={{ scale: 0.8 }}>
            {priceFormatter.format(variantPrice)}
          </Typography>
        </Box>
      </Button>
    </>
  );
}

export function StockButton({ stock, onClick, isSelected }) {
  const getImageName = (value) => {
    // truncate after "."
    return value.split(".")[0];
  };

  return (
    <>
      <Tooltip
        title={
          <div>
            {stock.imageUrls.map((url, index) => (
              <img
                key={index + url}
                src={url}
                alt={stock.imageNames[index]}
                width={100} // adjust size as needed
                height={100} // adjust size as needed
              />
            ))}
          </div>
        }
      >
        <Button
          startIcon={
            <img
              src={stock.imageUrls[0]}
              alt={stock.imageNames[0]}
              width={24}
              height={24}
            />
          }
          variant={isSelected ? "contained" : "outlined"}
          color="primary"
          onClick={onClick}
        >
          {getImageName(stock.color)}
        </Button>
      </Tooltip>
    </>
  );
}

export function ProductStockButtonArea({
  stocks,
  variantIndex,
  selectedStockIndex,
  onClick,
}) {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          gap: 1,
          gridTemplateColumns: [
            "repeat(1, 1fr)", // mobile
            "repeat(2, 1fr)", // tablet
            "repeat(2, 1fr)", // desktop
            "repeat(3, 1fr)", // larger screens
          ],
        }}
      >
        {stocks.map((stock, index) => {
          return stock.variantIndex === variantIndex ? (
            <StockButton
              stock={stock}
              onClick={() => {
                onClick(index);
              }}
              key={"stock"+stock.id}
              isSelected={selectedStockIndex === index}
            />
          ) : null;
        })}
      </Box>
    </>
  );
}

export function ProductIconsArea({ product }) {
  return (
    <>
      <Box
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          display: "flex",
          flexWrap: "wrap",
          // gridTemplateColumns: [
          //   "repeat(4, 1fr)", // mobile
          //   "repeat(4, 1fr)", // tablet
          //   "repeat(3, 1fr)", // desktop
          //   "repeat(3, 1fr)",
          // ],
          gap: 1,
          m: 1,
        }}
      >
        <ChipWithTitle
          title="Screen"
          icon={<ScreenshotIcon color="primary" />}
          body={product.screenSize + " inch"}
        />
        <ChipWithTitle
          title="CPU"
          icon={<MemoryTwoToneIcon color="primary" />}
          body={product.cpuName}
        />
        <ChipWithTitle
          title="Cores"
          icon={<DeveloperBoardRoundedIcon color="primary" />}
          body={product.coresNumber}
        />
        <ChipWithTitle
          title="Front Cam"
          icon={<CameraAltRoundedIcon color="primary" />}
          body={product.frontCameraResolution}
        />
        <ChipWithTitle
          title="Back Cam"
          icon={<FlipCameraIosRoundedIcon color="primary" />}
          body={product.backCameraResolution}
        />
        <ChipWithTitle
          title="Battery"
          icon={<Battery5BarRoundedIcon color="primary" />}
          body={product.battery + " mAh"}
        />
      </Box>
    </>
  );
}

function ButtonArea({ product, selectedStock, quantity }) {
  const { showSnackbar } = useSnackbarUtils();
  const user = useSelector((state) => state.user.user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleShowDialog = () => {
    setDialogOpen(true);
  };

  const handleAddToCart = async () => {
    if (!user) {
      showSnackbar("Please login to add item to cart", "warning", true);
      return;
    }

    const data = {
      userId: user.id,
      productId: product.id,
      quantity: quantity,
      stockId: selectedStock.id,
    };

    await addItemToCart(
      user.cartId,
      data,
      (cart) => {
        console.log(">>>check add item to cart: ", cart);
        if (cart) {
          handleShowDialog();
        } else {
          showSnackbar("Failed to add item to cart", "error", true);
        }
      },
      (error) => {
        console.log(">>>error add item to cart", error);
        showSnackbar("Failed to add item to cart" + error, "error", true);
      }
    );
  };

  const handleBuyNow = () => {
    navigate("/shopping/checkout", {
      state: {
        products: [product],
        stocks: [selectedStock],
        quantities: [quantity],
        cart: null,
        total: product.finalPrices[selectedStock.variantIndex] * quantity,
        voucher: null,
        cartItemIndices: null,
      }
    })
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          m: 1,
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            startIcon={<ShoppingCart />}
            variant="outlined"
            color="primary"
            sx={{
              fontSize: "1rem",
              padding: "10px 16px",
            }}
            onClick={() => {
              handleAddToCart();
            }}
            size="large"
          >
            {"Add to cart"}
          </Button>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            startIcon={<Shop2Icon />}
            variant="contained"
            color="primary"
            sx={{
              fontSize: "1rem",
              padding: "10px 16px",
            }}
            onClick={handleBuyNow}
            size="large"
          >
            {"Buy now"}
          </Button>
        </Paper>
      </Box>
      <ShowDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        message="Prodcut added to cart"
        gifUrl={successGif}
        duration={1000}
      />
    </ThemeProvider>
  );
}

export function ProductPerk({ remainingStocks = 0 }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          // gridTemplateColumns: [
          //   "repeat(2, 1fr)", // mobile
          //   "repeat(2, 1fr)", // tablet
          //   "repeat(2, 1fr)", // desktop
          //   "repeat(2, 1fr)", // larger screens
          // ],
          width: "100%",
        }}
      >
        <ChipWithTitleV2
          title="Free Shipping"
          icon={<LocalShipping color="primary" />}
          body="over $100"
        />
        <ChipWithTitleV2
          title="Doorstep Delivery"
          icon={<GiteIcon color="primary" />}
          body="within 2 days"
        />
        <ChipWithTitleV2
          title="Stock"
          icon={<WarehouseIcon color="primary" />}
          body={remainingStocks + " left"}
        />
        <ChipWithTitleV2
          title="Verified"
          icon={<VerifiedIcon color="primary" />}
          body="genuine product"
        />
      </Box>
    </>
  );
}

export function ProductInfo({ product }) {
  const { showSnackbar } = useSnackbarUtils();
  const [stocks, setStocks] = useState(null);
  const [selectedStockIndex, setSelectedStockIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const location = useLocation();

  const getFirstStockOfVariant = (stockList, variantIndex) => {
    for (let i = 0; i < stockList.length; i++) {
      if (stockList[i].variantIndex === variantIndex) {
        return i;
      }
    }
    return 0;
  };

  const handleVariantClick = (index) => {
    if(index === selectedVariantIndex) {
      return;
    }
    if(stocks === null) {
      return;
    }
    setSelectedVariantIndex(index);
    /*find the first stock of this variant */
    setSelectedStockIndex(getFirstStockOfVariant(stocks, index));
  };

  useEffect(() => {
    getAllProductStocks(
      product.id,
      (rStocks) => {
        setStocks(rStocks);
        setSelectedStockIndex(getFirstStockOfVariant(rStocks, 0));
      },
      (error) => {
        showSnackbar(error, "warning", true);
        console.log(error);
      }
    );
  }, [product.id]);

  if (product === null) {
    return (
      <>
        <Typography variant="h4" color="error">
          {"<product> is null"}
        </Typography>
      </>
    );
  }

  if (stocks === null) {
    return (
      <>
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation={false} height={180} />
          <Skeleton animation="wave" height={80} />
        </Box>
      </>
    );
  }

  const variantCount = product.variantCount;
  const variantName = product.variantName;
  const variantMemory = product.variantMemory;
  const variantMemoryDataUnit = product.variantMemoryDataUnit;
  const variantStorage = product.variantStorage;
  const variantStorageDataUnit = product.variantStorageDataUnit;
  const variantPrice = product.finalPrices;

  if(stocks[selectedStockIndex] === undefined) {
    debugger;
  }

  const variantIndex = stocks[selectedStockIndex].variantIndex;
  const variantIndices =
    variantCount === 1 ? [0] : [...Array(variantCount).keys()];

  return (
    <>
      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
          // border: "1px solid black",
        }}
        // force rerender when location changes
        key={location.pathname}
      >
        {/* Title */}
        <Typography variant="h5" color="primary">
          {product.name + " " + variantName[selectedVariantIndex]}
        </Typography>
        {/* Price */}
        <Typography variant="h5">
          {priceFormatter.format(variantPrice[selectedVariantIndex])}
        </Typography>
        {/* Variants Selection */}
        <Box
          sx={{
            display: "grid",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            gap: 1,
            gridTemplateColumns: [
              "repeat(3, 1fr)", // mobile
              "repeat(3, 1fr)", // tablet
              "repeat(3, 1fr)", // desktop
              "repeat(3, 1fr)", // larger screens
            ],
          }}
        >
          {variantIndices.map((index) => {
            return (
              <VariantButton
                variantName={variantName}
                variantIndex={index}
                selectedStock={selectedStockIndex}
                variantPrice={variantPrice[index]}
                isSelected={index === selectedVariantIndex}
                key={index}
                onClick={() => handleVariantClick(index)}
              />
            );
          })}
        </Box>
        {/* Stock Selection */}
        <Typography variant="p">{"Select color:"}</Typography>
        <ProductStockButtonArea
          stocks={stocks}
          variantIndex={selectedVariantIndex}
          selectedStockIndex={selectedStockIndex}
          onClick={(stockIndex) => {
            setSelectedStockIndex(stockIndex);
          }}
          key="stockButtonArea"
        />
        {/* Icons */}
        {product.productType === PRODUCT_TYPES.PHONE && <ProductIconsArea product={product} />}
        {/* Product overview */}
        <Typography variant="p">{"Overview:"}</Typography>
        <Typography variant="p" color="primary">
          <ExpandableText text={product.overview} maxLength={200} />
        </Typography>
        {/* Buttons */}
        <ButtonArea
          selectedStock={
            selectedStockIndex !== null ? stocks[selectedStockIndex] : null
          }
          product={product}
          quantity={1}
        />
        {/* Perks */}
        <ProductPerk remainingStocks={stocks[selectedStockIndex].quantity} />
      </Box>
    </>
  );
}

export default function ProductShowcase({ product }) {
  const [reviews, setReviews] = useState([]);

  const { showSnackbar } = useSnackbarUtils();
  const location = useLocation();

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
  }, [product.id]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          // border: "1px solid red",
        }}
      >
        {/* Rating & name*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            width: "100%",
            gap: 1,
          }}
        >
          <ProductRating productId={product.id} />
          <Typography variant="p" color="primary">
            {product.name}
          </Typography>
          <Typography variant="p" marginLeft={2}>
            {reviews.length + " reviews"}
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }} />
        {/* Main info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 1,
            // border: "1px solid blue",
          }}
        >
          {/* Right 60% for large device and 100% for <= small*/}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "100%", md: "60%" },
              flexWrap: "wrap",
              // border: "1px solid lightgray",
            }}
          >
            <SimpleImageCarousel
              images={product.imageUrls}
              imageNames={product.imageNames}
            />
          </Box>
          {/* Left 40% for large device and 100% for <= small*/}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "100%", md: "40%" },
              // border: "1px solid lightgray",
              padding: 2,
              flexWrap: "wrap",
            }}
          >
            <ProductInfo
              product={product}
              key={location.pathname + "product-info"}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
