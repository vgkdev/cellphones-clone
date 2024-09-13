import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import { IconButton, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../store/actions/userAction";
import { violet_theme } from "../../theme/AppThemes";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { CloseOutlined } from "@mui/icons-material";

const forgotPwdModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FORGOT_COOLDOWN_PERIOD = 15000;

export default function ResetPasswordPopup({ open, handleClosePopup }) {
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [isOnCooldownResetPwd, setIsOnCooldownResetPwd] = React.useState(false);
  const [forgotCooldownSec, setForgotCooldownSec] = React.useState(0);
  const [shouldShowSnackbar, setShouldShowSnackbar] = React.useState(false);
  const dispatch = useDispatch();

  const { showSnackbar } = useSnackbarUtils();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    console.log("Reset password");
    try {
      await dispatch(forgotPassword({ email: forgotEmail }));
      setShouldShowSnackbar(true);
      setForgotEmail("");
     
      setTimeout(() => {
        handleClosePopup(false);
      }, 3000);

    } catch (error) {
      showSnackbar("Reset password failed. Please try again.", "error");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnCooldownResetPwd) {
        setForgotCooldownSec(forgotCooldownSec + 1000);
        if (forgotCooldownSec >= FORGOT_COOLDOWN_PERIOD) {
          setIsOnCooldownResetPwd(false);
          setForgotCooldownSec(0);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotCooldownSec, isOnCooldownResetPwd]);

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    handleClosePopup(false);
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Snackbar
        open={shouldShowSnackbar}
        autoHideDuration={6000}
        onClose={() => setShouldShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShouldShowSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Please check your email!
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={forgotPwdModalStyle} component="form">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseOutlined />
          </IconButton>
          <CssBaseline />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reset password
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Fill in your email address to reset your password
          </Typography>
          <TextField
            sx={{
              backgroundImage: "linear-gradient(#e7f0fe, #e7f0fe)",
            }}
            margin="normal"
            required
            fullWidth
            id="forgotEmail"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            color="custom"
            onChange={(e) => {
              setForgotEmail(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleOutlined />
                </InputAdornment>
              ),
            }}
          />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="custom"
              onClick={(e) => {
                setIsOnCooldownResetPwd(true);
                handleResetPassword(e);
              }}
              disabled={isOnCooldownResetPwd}
            >
              {isOnCooldownResetPwd
                ? `Resend in ${Math.floor(
                    (FORGOT_COOLDOWN_PERIOD - forgotCooldownSec) / 1000
                  )}s`
                : "Send"}
            </Button>
          </Grid>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
