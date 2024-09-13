import { Box, Button, Typography } from "@mui/material";
import * as React from "react";

export default function ChipWithTitle({
  icon,
  title = "",
  body = "",
  width = "140px",
  height = "75px",
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: {xs: "90px", sm: "100px", md: "120px", lg: "120px", xl: "140px"},
          aspectRatio: "16/9",
          borderRadius: "10px",
          backgroundColor: "#F4F4F4",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "70%",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
              color: "#A7A7A7",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
              transform: "scale(0.8)",
              color: "#4E4E4E",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {body}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
