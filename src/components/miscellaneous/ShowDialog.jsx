import React, { useEffect } from "react";
import { Dialog, DialogContent, Typography, Box } from "@mui/material";

const ShowDialog = ({ open, handleClose, message, gifUrl, duration }) => {
  useEffect(() => {
    if (open && duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      // Cleanup the timer if the component is unmounted or if open changes
      return () => clearTimeout(timer);
    }
  }, [open, duration, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="notification-dialog-title"
      aria-describedby="notification-dialog-description"
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 2,
          }}
        >
          <img
            src={gifUrl}
            alt="notification gif"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography variant="h6" component="p" sx={{ marginTop: 2 }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShowDialog;
