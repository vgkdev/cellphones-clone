import { Box, ThemeProvider, Typography } from "@mui/material";
import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import { priceFormatter } from "../../utils/stringHelper";

export default function PlaceOrderItem({ product, stock, quantity }) {
  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <img
            src={stock.imageUrls[0]}
            alt={stock.imageNames[0]}
            style={{ width: "50px", height: "50px" }}
          />
          <Typography variant="p" fontWeight={"bold"} color={"primary"}>
            {product.name +
              " " +
              product.variantName[stock.variantIndex] +
              " " +
              stock.color}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="p" fontWeight="bold">
            Name
          </Typography>
          <Typography variant="p">{product.name}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="p" fontWeight="bold">
            Quantity
          </Typography>
          <Typography variant="p">{quantity}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="p" fontWeight="bold">
            Price
          </Typography>
          <Typography variant="p">
            {priceFormatter.format(
              product.finalPrices[stock.variantIndex] * quantity
            )}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
