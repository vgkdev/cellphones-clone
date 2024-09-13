import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInUser } from "../../store/actions/userAction";
import { violet_theme } from "../../theme/AppThemes";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import ResetPasswordPopup from "./ResetPasswordPopup";

export default function SignInShopping() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbarUtils();
  const [openResetPasswordPopup, setOpenResetPasswordPopup ] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({
      email: email,
      password: password,
    });

    const payload = {
      email: email,
      password: password,
    };
    try {
      await dispatch(signInUser(payload, navigate, true, true));
    } catch (error) {
      console.error("Failed to sign in user", error);
      showSnackbar("Email or password is incorrect", "error");
    }
  };

  const handleOpenResetPasswordPopup = () => {
    setOpenResetPasswordPopup(true);
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2"
                  onClick={() => {
                    handleOpenResetPasswordPopup();
                  }}
                >
                  Quên mật khẩu
                </Link>
              </Grid>
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => {
                    navigate("/shopping/sign-up");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {"Đăng kí"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ResetPasswordPopup
        open={openResetPasswordPopup}
        handleClosePopup={setOpenResetPasswordPopup}
      />
    </ThemeProvider>
  );
}
