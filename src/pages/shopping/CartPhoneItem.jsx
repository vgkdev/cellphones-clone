import {
  Box,
  Button,
  Checkbox,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";
import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import { Link } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { priceFormatter } from "../../utils/stringHelper";
export default function CartPhoneItem({
  index,
  product,
  stock,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onRemove,
  selected,
  setSelected,
}) {
  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={1}
        width="100%"
        sx={{
          flexWrap: "wrap",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          width="10%"
        >
          <Checkbox
            color="primary"
            checked={selected}
            onChange={() => {
              if (setSelected) {
                setSelected(index, !selected);
              } else {
                console.warn("setSelected not defined");
              }
            }}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="start"
          width="40%"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="start"
            justifyContent="start"
            marginLeft={1}
          >
            <img
              src={stock.imageUrls[0]}
              alt={stock.color}
              width="100"
              height="100"
            />
            <Box
              display="flex"
              flexDirection="column"
              alignItems="start"
              justifyContent="start"
              marginLeft={1}
            >
              <Link
                variant="h6"
                color="primary"
                cursor="pointer"
                to={`/shopping/all-products/${product.id}`}
              >
                <Typography variant="h6" color="primary" marginBottom={2}>
                  {product.name + " " + product.variantName[stock.variantIndex]}
                </Typography>
              </Link>
              <Typography variant="body1" color="primary">
                {stock.color}
              </Typography>

              <Typography variant="body1" color="primary">
                {"#" + stock.id}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          width="50%"
        >
          <IconButton
            color="primary"
            aria-label="decrease"
            onClick={() => {
              if (onQuantityDecrease) {
                onQuantityDecrease(index);
              } else {
                console.warn("onQuantityDecrease not defined");
              }
            }}
          >
            <Remove />
          </IconButton>

          <Typography
            variant="body1"
            color="primary"
            textAlign={"center"}
            paddingLeft={3}
            paddingRight={3}
            borderRadius={1}
            border="1px solid"
          >
            {quantity}
          </Typography>

          <IconButton
            color="primary"
            aria-label="increase"
            onClick={() => {
              if (onQuantityIncrease) {
                onQuantityIncrease(index);
              } else {
                console.warn("onQuantityIncrease not defined");
              }
            }}
          >
            <Add />
          </IconButton>

          <Typography
            variant="body1"
            color="primary"
            textAlign={"center"}
            fontWeight="bold"
            marginLeft={4}
          >
            {priceFormatter.format(
              product.finalPrices[stock.variantIndex] * quantity
            )}
          </Typography>

          <IconButton
            color="primary"
            aria-label="delete"
            onClick={() => {
              if (onRemove) {
                onRemove(index);
              } else {
                console.warn("onRemove not defined");
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
