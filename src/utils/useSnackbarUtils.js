import React from "react";
import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Custom hook to show snackbar notifications
 * @returns {function} showSnackbar
 * @timeout is 2000ms by default
 */
export const useSnackbarUtils = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * Show a snackbar notification
   * @param {*} message 
   * @param {*} variant 
   * @param {*} stayForever should the snackbar autohide or not. If true it ignores the timeout
   * @param {*} timeout 2000ms by default
   * @param {*} vertical 
   * @param {*} horizontal 
   */
  const showSnackbar = (
    message,
    variant = "default",
    stayForever = false,
    timeout = 2000,
    vertical = "top",
    horizontal = "center"
  ) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical, horizontal },
      autoHideDuration: stayForever ? null : timeout,
      action: (key) => (
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
    });
  };

  return { showSnackbar };
};
