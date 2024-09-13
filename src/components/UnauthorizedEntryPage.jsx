import * as React from "react";

import { Box, Button, Grid, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../theme/AppThemes";
import thiefImage from "../assets/images/thief_1.png";

export default function UnauthorizedPage() {
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
        <Typography variant="h2" color="primary">
          Error 401
        </Typography>
        <img
          src={thiefImage}
          alt="Unauthorized access"
          width="400px"
          height="400px"
        />
        <Typography variant="h3">Unauthorized access</Typography>
        <Typography variant="h6" color="primary">
          You do not have permission to access this page
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
