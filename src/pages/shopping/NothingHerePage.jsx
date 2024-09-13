import * as React from "react";

import { Box, Button, Grid, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import notFoundImage from "../../assets/images/notFound_1.png";
import { violet_theme } from "../../theme/AppThemes";

export default function NothingHerePage() {
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
        <Typography variant="h3" color="primary">
          {" "}
          There is nothing here. Did you get lost?
        </Typography>
        <img
          src={notFoundImage}
          alt="Page not found"
          width="400px"
          height="400px"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.replace("/")}
        >
          Go to home
        </Button>
      </Box>
    </ThemeProvider>
  );
}
