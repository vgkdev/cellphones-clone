import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Facebook, LinkedIn, Instagram } from "@mui/icons-material";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isDashboardPage = currentPath.startsWith("/dashboard/");

  return (
    <ThemeProvider theme={violet_theme}>
      {!isDashboardPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 20%",
            background: "linear-gradient(to right, #D3D3D3, #6D6D6D)",
          }}
        >
          <Box>
            <Typography variant="h6" component="h2">
              Về BuyPhone
            </Typography>
            <Typography>
              <Link
                href="#"
                underline="none"
                sx={{ color: "white" }}
                component={RouterLink}
                to="/shopping/all-products"
              >
                All Products
              </Link>
            </Typography>
            <Typography>
              <Link
                href="#"
                color="inherit"
                underline="none"
                sx={{ color: "white" }}
              >
                Voucher
              </Link>
            </Typography>
            <Typography>
              <Link
                href="#"
                color="inherit"
                underline="none"
                sx={{ color: "white" }}
                component={RouterLink}
                to="/shopping/edit-profile"
              >
                Profile
              </Link>
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" component="h2">
              Theo dõi chúng tôi tại
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Link
                href="https://facebook.com"
                color="inherit"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Facebook sx={{ mr: 1 }} />
                <Typography sx={{ color: "white" }}>Facebook</Typography>
              </Link>
              <Link
                href="https://linkedin.com"
                color="inherit"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <LinkedIn sx={{ mr: 1 }} />
                <Typography sx={{ color: "white" }}>LinkedIn</Typography>
              </Link>
              <Link
                href="https://instagram.com"
                color="inherit"
                underline="none"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Instagram sx={{ mr: 1 }} />
                <Typography sx={{ color: "white" }}>Instagram</Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Footer;
