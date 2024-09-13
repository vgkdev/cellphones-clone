import * as React from "react";

import {
  Box,
  Button,
  Grid,
  Paper,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { isValidHtml, normalizeSvg } from "../../utils/stringHelper";

export default function ProducerCard({ producer }) {
  if (producer === undefined || !producer) {
    console.error("ProducerCard: producer is undefined or null");
    return null;
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Tooltip title={producer.description} placement="top" arrow>
        <Paper elevation={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              padding: 2,
              m: 1,
              backgroundImage: `url(https://media.giphy.com/media/geyxhpQ1f34gIPIABw/giphy.gif?cid=ecf05e47zisbg6w411q9ev7gqco9oohv734gtu4sb9ukq2u9&ep=v1_gifs_search&rid=giphy.gif&ct=s)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat", // Ensure the image doesn't repeat
              backgroundPosition: "center",
            }}
          >
            {isValidHtml(producer.logoSvg) ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: normalizeSvg(producer.logoSvg, "70"),
                }}
              />
            ) : null}

            <Typography
              variant="p"
              color="primary"
              fontWeight="bold"
              sx={{ fontFamily: "'Brush Script MT', cursive" }} // Add this line
            >
              {producer.name}
            </Typography>
          </Box>
        </Paper>
      </Tooltip>
    </ThemeProvider>
  );
}
