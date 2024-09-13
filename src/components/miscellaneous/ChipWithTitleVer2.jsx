import { Box, Button, Typography } from "@mui/material";
import * as React from "react";

export default function ChipWithTitleV2({
  icon,
  title = "",
  body = "",
  width = "180px",
  height = "69px",
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          width: width,
          height: height,
          borderRadius: "10px",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
            aspectRatio: "1 / 1",
            backgroundColor: "#F6F6F6",
            borderRadius: "10px",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
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
