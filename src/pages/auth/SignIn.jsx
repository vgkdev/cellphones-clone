import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import cover from "../../assets/svg/BuyPhoneOne_violet_bg.svg";
import Modal from "@mui/material/Modal";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInUser,
  forgotPassword,
  googleSignIn,
  githubSignIn,
} from "../../store/actions/userAction";
import { violet_theme } from "../../theme/AppThemes";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        buyphone1.vn
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

const useStyles = makeStyles((theme) => ({
  debugOutline: {
    outline: "1px solid blue",
  },
  debugOutlineBlue: {
    outline: "1px solid blue",
  },
  debugOutlineRed: {
    outline: "1px solid red",
  },
  debugOutlineGreen: {
    outline: "1px solid green",
  },
  debugOutlinePurple: {
    outline: "1px solid purple",
  },
}));

const SUCCESS_VALIDATION = "OK";
const NONE_VALIDATION = "";
const FORGOT_COOLDOWN_PERIOD = 15000;

export default function SignInSide() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailAdd, setEmailAdd] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [emailValidation, setEmailValidation] = React.useState(NONE_VALIDATION);
  const [passwordValidation, setPasswordValidation] =
    React.useState(NONE_VALIDATION);
  const [openForgotPasswordModal, setOpenForgotPasswordModal] =
    React.useState(false);
  const handleOpenForgotPasswordModal = () => setOpenForgotPasswordModal(true);
  const handleCloseForgotPasswordModal = () =>
    setOpenForgotPasswordModal(false);
  const [isOnCooldownResetPwd, setIsOnCooldownResetPwd] = React.useState(false);
  const [forgotCooldownSec, setForgotCooldownSec] = React.useState(0);
  const [shouldShowSnackbar, setShouldShowSnackbar] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const classes = useStyles();

  const { showSnackbar } = useSnackbarUtils();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      email: emailAdd,
      password: password,
    };
    try {
      await dispatch(signInUser(payload, navigate, rememberMe)).catch((error) => {
        showSnackbar("Email or password is incorrect!", "error");
        setEmailValidation("Email or password is incorrect");
        setPasswordValidation("Email or password is incorrect");
      });
    } catch (error) {
      console.error("Error signing in: ", error);
      showSnackbar("Email or password is incorrect!", "error");
      setEmailValidation("Email or password is incorrect");
      setPasswordValidation("Email or password is incorrect");
    }
  };

  const handleGoogleSignIn = (event) => {
    event.preventDefault();
    dispatch(googleSignIn(navigate, rememberMe)).catch((error) => {
      showSnackbar(
        "Sign in with Google failed. Please try again or use a different account.",
        "error"
      );
    });
  };

  const handleGithubSignIn = (event) => {
    event.preventDefault();
    dispatch(githubSignIn(navigate, rememberMe)).catch((error) => {
      showSnackbar(
        "Sign in with Github failed. Please try again or use a different account.",
        "error"
      );
    });
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    console.log("Reset password");
    dispatch(forgotPassword({ email: forgotEmail })).catch((error) => {
      showSnackbar("Reset password failed. Please try again.", "error");
    });
  };

  // const resetForm = () => {
  //   setEmailValidation(NONE_VALIDATION);
  //   setPasswordValidation(NONE_VALIDATION);
  // };

  const validateEmail = (email) => {
    if (email === "") {
      setEmailValidation("Email is required");
    } else if (!email.includes("@") || !email.includes(".")) {
      setEmailValidation("Email is invalid");
    } else {
      setEmailValidation(SUCCESS_VALIDATION);
    }
  };

  const validatePassword = (password) => {
    if (password === "") {
      setPasswordValidation("Password is required");
    } else if (password.length < 6) {
      setPasswordValidation("Password is too short");
    } else {
      setPasswordValidation(SUCCESS_VALIDATION);
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

  const handleOpen = () => {
    setShouldShowSnackbar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShouldShowSnackbar(false);
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Grid container component="main" sx={{ height: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={4}
          sx={{
            backgroundImage: `url(${cover})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={8}
          component={Paper}
          elevation={6}
          square
          className={classes.debugOutlineBlue}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundImage: "linear-gradient(#FCD2D1, #FE8F8F)",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "510px",
              borderRadius: "10px",
              backgroundImage: "linear-gradient(#e7f0fe, #e7f0fe)",
            }}
            className={classes.debugOutlineRed}
            p={4}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Lucida Calligraphy'",
                color: "#DB0A5B",
              }}
            >
              Administration
            </Typography>
            <Typography variant="h6">Sign in</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                color="custom"
                helperText={
                  emailValidation.toLowerCase() ===
                    SUCCESS_VALIDATION.toLowerCase() ||
                  emailValidation.toLowerCase() ===
                    NONE_VALIDATION.toLowerCase()
                    ? null
                    : emailValidation
                }
                error={
                  emailValidation.toLowerCase() ===
                    SUCCESS_VALIDATION.toLowerCase() ||
                  emailValidation.toLowerCase() ===
                    NONE_VALIDATION.toLowerCase()
                    ? false
                    : true
                }
                onChange={(e) => {
                  setEmailAdd(e.target.value);
                  validateEmail(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                color="custom"
                helperText={
                  passwordValidation.toLowerCase() ===
                    SUCCESS_VALIDATION.toLowerCase() ||
                  passwordValidation.toLowerCase() ===
                    NONE_VALIDATION.toLowerCase()
                    ? null
                    : passwordValidation
                }
                error={
                  passwordValidation.toLowerCase() ===
                    SUCCESS_VALIDATION.toLowerCase() ||
                  passwordValidation.toLowerCase() ===
                    NONE_VALIDATION.toLowerCase()
                    ? false
                    : true
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      onChange={(e) => {
                        setRememberMe(e.target.value);
                      }}
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" onClick={handleOpenForgotPasswordModal}>
                  Forgot password?
                </Link>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="custom"
              >
                Sign In
              </Button>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="body1">Or sign in with</Typography>
                {/* google provider */}
                <IconButton
                  onClick={(e) => {
                    handleGoogleSignIn(e);
                  }}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/google-logo.png"
                    alt="Google Icon"
                    width={37}
                  ></img>
                </IconButton>
                {/* github provider */}
                <IconButton
                  onClick={(e) => {
                    handleGithubSignIn(e);
                  }}
                >
                  <img
                    src="https://img.icons8.com/fluency/48/000000/github.png"
                    alt="Github Icon"
                    width={37}
                  ></img>
                </IconButton>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={shouldShowSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent="SlideTransition"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Please check your email!
        </Alert>
      </Snackbar>

      <Modal
        open={openForgotPasswordModal}
        onClose={handleCloseForgotPasswordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={forgotPwdModalStyle} component="form">
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
                handleOpen();
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
