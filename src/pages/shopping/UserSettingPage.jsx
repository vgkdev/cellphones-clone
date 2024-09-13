import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import underContructionBgImg from "../../assets/images/under_construction_site.png";

export default function UserSettingPage() {
  return (
    <>
      <ThemeProvider theme={violet_theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              width: "80%",
              height: "100%",
            }}
          >
            <h1>Setting Page</h1>
            <img
              src={underContructionBgImg}
              alt="setting"
              style={{
                width: "500px",
                height: "auto",
              }}
            />
            <p>Under construction...</p>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
