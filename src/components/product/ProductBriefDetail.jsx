import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import * as React from "react";

import { violet_theme } from "../../theme/AppThemes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProductDetailTable from "../../pages/components/dashboard/ProductDetailTable";
import { useEffect } from "react";
import { PRODUCT_TYPES } from "../../models/Product";

function BreakLine() {
  return (
    <>
      <Divider
        sx={{
          bgcolor: "lightgray",
          width: "100%",
          height: "1px",
          marginTop: 1,
          marginBottom: 1,
        }}
      />
    </>
  );
}

export default function ProductBriefDetail({ product, onClose = null }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <ThemeProvider theme={violet_theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" color="primary">
            About
          </Typography>
          <Typography variant="p" color="primary">
            {product.name}
          </Typography>
          <Typography variant="p" color="black" marginTop={2}>
            {product.overview}
          </Typography>

          {product.productType === PRODUCT_TYPES.PHONE && (
            <ThemeProvider theme={violet_theme}>
              <Typography variant="h6" color="primary" marginTop={2}>
                Screen
              </Typography>

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Resolution
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.screenWidth + "x" + product.screenHeight}
                  </Typography>
                </Grid>
              </Grid>

              <BreakLine />

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Size
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.screenSize + " inches"}
                  </Typography>
                </Grid>
              </Grid>

              <BreakLine />

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Type
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.screenOutlook}
                  </Typography>
                </Grid>
              </Grid>

              <BreakLine />

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Refresh Rate
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.refreshRate + "Hz"}
                  </Typography>
                </Grid>
              </Grid>
              <BreakLine />

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Tech
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.screenTech}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" color="primary" marginTop={2}>
                Cpu
              </Typography>

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Type
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.cpuName}
                  </Typography>
                </Grid>
              </Grid>

              <BreakLine />

              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="p" color="black" fontWeight="bold">
                    Core
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="p" color="black">
                    {product.coresNumber}
                  </Typography>
                </Grid>
              </Grid>
            </ThemeProvider>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: 80,
              marginTop: -5,
              background:
                "linear-gradient(45deg, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.1) 90%)", // Add this line
            }}
            width="100%"
          >
            <Button
              style={{
                display: "block",
                margin: "0 auto",
                marginTop: "20px",
              }}
              variant="outlined"
              onClick={handleClickOpen}
              endIcon={<KeyboardArrowDownIcon />}
              size="small"
            >
              View more
            </Button>
          </Box>
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm" // Set the maximum width to "md"
          fullWidth
        >
          <DialogTitle
            sx={{
              background: (theme) => theme.palette.primary.main,
            }}
          >
            <Box
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
              }}
            >
              <Typography>{product.name + " specifications"}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <ProductDetailTable product={product} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              variant="contained"
              sx={{ width: "40%", margin: "auto" }} // Add this line
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
