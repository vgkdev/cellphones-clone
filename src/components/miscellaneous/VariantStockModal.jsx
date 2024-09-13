import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, Button, IconButton } from "@mui/material";
import { ProductStockButtonArea, VariantButton } from "../ProductShowcase";
import { getAllProductStocks } from "../../db/dbStock";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { addItemToCart, getAllCart } from "../../db/dbCart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VariantStockModal = ({
  open,
  handleClose,
  product,
  actionType,
  handleShowDialog,
  handleCloseDialog,
}) => {
  const [stocks, setStocks] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedStockIndex, setSelectedStockIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { showSnackbar } = useSnackbarUtils();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const getFirstStockOfVariant = (variantIndex) => {
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].variantIndex === variantIndex) {
        return i;
      }
    }
    return 0;
  };

  const handleVariantClick = (index) => {
    setSelectedVariantIndex(index);
    /*find the first stock of this variant */
    setSelectedStockIndex(getFirstStockOfVariant(index));
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  useEffect(() => {
    // prevent no colors selection when first mounted
    if (stocks === null) return;
    setSelectedStockIndex(getFirstStockOfVariant(0));
  }, [stocks]);

  useEffect(() => {
    getAllProductStocks(
      product.id,
      (stocks) => {
        setStocks(stocks);
      },
      (error) => {
        showSnackbar(error, "warning", true);
        console.log(error);
      }
    );
  }, [product.id]);

  // reset when first mounted
  useEffect(() => {
    setSelectedStockIndex(0);
  }, []);

  // reset when stocks change
  useEffect(() => {
    setSelectedStockIndex(0);
  }, [stocks]);

  const variantCount = product.variantCount;
  const variantIndices =
    variantCount === 1 ? [0] : [...Array(variantCount).keys()];

  const handleAddToCart = async () => {
    if (!user) {
      showSnackbar("Please sign in to add to cart", "warning", true);
      return;
    }

    const data = {
      userId: user.id,
      productId: product.id,
      quantity: quantity,
      stockId: stocks[selectedStockIndex].id,
    };
    await addItemToCart(
      user.cartId,
      data,
      (cart) => {
        console.log(">>>check add item to cart: ", cart);
        if (cart) {
          handleClose();
          handleShowDialog();
        }
      },
      (error) => {
        console.log(">>>error add item to cart", error);
      }
    );
  };

  const handleBuyNow = () => {
    navigate("/shopping/checkout", {
      state: {
        products: [product],
        stocks: [stocks[selectedStockIndex]],
        quantities: [quantity],
        cart: null,
        total: product.finalPrices[selectedVariantIndex] * quantity,
        voucher: null,
        cartItemIndices: null,
      }
    })
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" component="h2">
          Select Variant and Stock
        </Typography>
        <Box
          sx={{
            display: "grid",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            gap: 1,
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {variantIndices.map((index) => (
            <VariantButton
              variantName={product.variantName}
              variantIndex={index}
              selectedStock={selectedStockIndex}
              variantPrice={product.finalPrices[index]}
              isSelected={index === selectedVariantIndex}
              key={index}
              //   onClick={() => setSelectedVariantIndex(index)}
              onClick={() => handleVariantClick(index)}
            />
          ))}
        </Box>
        <Typography variant="p">{"Select color:"}</Typography>
        <ProductStockButtonArea
          stocks={stocks}
          variantIndex={selectedVariantIndex}
          selectedStockIndex={selectedStockIndex}
          onClick={(stockIndex) => setSelectedStockIndex(stockIndex)}
          key="stockButtonArea"
        />
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <IconButton onClick={() => handleQuantityChange(-1)}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2 }}>
            {quantity}
          </Typography>
          <IconButton onClick={() => handleQuantityChange(1)}>
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          {actionType === "addToCart" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}
          {actionType === "buyNow" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default VariantStockModal;
