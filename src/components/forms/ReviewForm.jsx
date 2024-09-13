import * as React from "react";

import { Box, Typography, TextField, Button } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { violet_theme } from "../../theme/AppThemes";

export default function ReviewForm() {
  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "primary.main",
          border: 1,
        }}
      >
        <Typography variant="h6">Rating & Review</Typography>
        <TextField id="outlined-basic" label="Name" variant="outlined" />
        <TextField id="outlined-basic" label="Email" variant="outlined" />
        <TextField
          id="outlined-basic"
          label="Review"
          variant="outlined"
          multiline
          rows={4}
        />
        <Button variant="contained">Submit</Button>
      </Box>
    </ThemeProvider>
  );
}
