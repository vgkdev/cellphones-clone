import * as React from "react";

import { Box, Button, Grid, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../theme/AppThemes";
import notFoundImage from "../assets/images/notFound_2.png";

export default function PageNotFound() {
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
          Error 404
        </Typography>
        <img
          src={notFoundImage}
          alt="Page not found"
          width="400px"
          height="400px"
        />
        <Typography variant="h6" color="primary">
          Page not found
        </Typography>
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
