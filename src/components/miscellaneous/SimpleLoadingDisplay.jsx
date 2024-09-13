import { Box, CircularProgress, Typography } from "@mui/material";
import * as React from "react";

import shopLogo from "../../assets/svg/shopLogo.svg";

import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../../theme/AppThemes";
import { useEffect } from "react";
import waitingImage from "../../assets/images/bot/analysis.png";

export function LoadingMessage() {
  const [loadingMessage, setLoadingMessage] = React.useState("Loading...");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingMessage((prevMessage) => {
        if (prevMessage === "Loading ...") return "Loading ..";
        if (prevMessage === "Loading ..") return "Loading .";
        if (prevMessage === "Loading .") return "Loading ...";
      });
    }, 200); // change every second

    // cleanup function
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <img src={shopLogo} alt="shopLogo" lt="shopLogo" height={50} width={50} />
      <Typography
        variant="h4"
        color="primary"
        align="center"
        alignContent="center"
      >
        <CircularProgress color="primary" />
        {loadingMessage}
      </Typography>
    </>
  );
}

export default function SimpleLoadingDisplay() {
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
        <img
          src={waitingImage}
          alt="waitingImage"
          width="200px"
          height="200px"
        />
        <LoadingMessage />
      </Box>
    </ThemeProvider>
  );
}
