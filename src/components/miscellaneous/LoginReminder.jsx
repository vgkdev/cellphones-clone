import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import pleaseLogin from "../../assets/images/please_login.png";

const LoginReminder = () => {
  return (
    <Box textAlign="center" my={3}>
      <img src={pleaseLogin} alt="Login" style={{ maxWidth: "100%" }} />
      <Typography variant="h5" gutterBottom>
        Xin vui lòng đăng nhập
      </Typography>
      <Button
        component={Link}
        to="/shopping/sign-in"
        variant="contained"
        color="primary"
      >
        Đăng nhập
      </Button>
    </Box>
  );
};

export default LoginReminder;
