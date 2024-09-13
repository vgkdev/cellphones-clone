import { Box, Grid, Typography } from "@mui/material";
import * as React from "react";

import shopLogo from "../../../assets/svg/shopLogo.svg";

export default function ShopHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={shopLogo} alt="shopLogo" lt="shopLogo" height={50} width={50} />

      <Typography
        fontSize={24}
        align="center"
        alignContent={"center"}
        sx={{
          color: "white",
          fontWeight: "regular",
        }}
      >
        BuyPhone1
      </Typography>
    </Box>
  );
}
