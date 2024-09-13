import * as React from "react";

import { violet_theme } from "../../../theme/AppThemes";
import { ThemeProvider } from "@emotion/react";
import { Box, Grid, Typography } from "@mui/material";
import { PRODUCT_TYPES, Product } from "../../../models/Product";
import { toSimpleDateString } from "../../../utils/date";
import { getStringFromStringArray } from "../../../utils/stringHelper";

export default function ProductDetailTable({ product }) {
  const pObj = Product.fromJson(product);

  return (
    <>
      <ThemeProvider theme={violet_theme}>
        {product.productType === PRODUCT_TYPES.PHONE && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
            }}
            width="100%"
          >
            <Typography variant="h5" color="primary">
              Screen
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
              }}
              width="100%"
            >
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Size
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.screenSize + " inches"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Refresh rate
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.refreshRate + " Hz"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Tech
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {product.screenTech}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Appearance
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.screenOutlook}
                  </Typography>
                </Grid>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography variant="p" color="black">
                      Resolution
                    </Typography>
                  </Grid>
                  <Grid item xs={8} container>
                    <Typography variant="p" color="black">
                      {pObj.screenWidth + " x " + pObj.screenHeight}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Features
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.screenFeatures}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Screen Features
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.screenFeatures}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h5" color="primary">
              Camera
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
              }}
              width="100%"
            >
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Front Camera
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.frontCamera}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Back Camera
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.backCamera}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Front Camera Video
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.frontCameraVideo}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Back Camera Video
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.backCameraVideo}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Front Camera Features
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.frontCameraFeatures}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Back Camera Features
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.backCameraFeatures}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h5" color="primary">
              Hardware
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
              }}
              width="100%"
            >
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Chipset
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.chipset}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    CPU
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.cpu}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    GPU
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.gpu}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Battery
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.battery}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Charger Tech
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.chargerTech}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Charger Connector
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.chargerConnector}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    SIM Card
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.simCard}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    OS
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.os}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Jack 3.5mm
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.jack_3_5mm}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    NFC
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.nfc}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Network
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.network}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Bluetooth
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.bluetooth}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Wifi
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.wifi}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    GPS
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.gps}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Phone Size
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.phoneWidth +
                      " x " +
                      pObj.phoneHeight +
                      " x " +
                      pObj.phoneDepth}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Weight
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.weight}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Back Material
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.backMaterial}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Frame Material
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.frameMaterial}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Compatibility
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.compatibility}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Water and Dust Proof
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.waterAndDustProof}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Additional Features
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.additionalFeatures}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Other Utilities
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.otherUtilities}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Sound Tech
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.soundTech}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Finger Print Tech
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.fingerPrintTech}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Sensors
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {getStringFromStringArray(pObj.sensors)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Special Features
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {pObj.specialFeatures}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: (theme) => theme.palette.whiteGray,
                  borderRadius: "8px",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="p" color="black">
                    Usages
                  </Typography>
                </Grid>
                <Grid item xs={8} container>
                  <Typography variant="p" color="black">
                    {getStringFromStringArray(pObj.usages)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h5" color="primary">
              Published At
            </Typography>
            <Typography variant="p" color="black">
              {toSimpleDateString(pObj.publishedAt)}
            </Typography>
          </Box>
        )}
        {/* Only name and overview */}
        {product.productType === PRODUCT_TYPES.ACCESSORY && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
            }}
            width="100%"
          >
            <Typography variant="h5" color="primary">
              Overview
            </Typography>
            <Typography variant="p" color="black">
              {product.overview}
            </Typography>
          </Box>
        )}
      </ThemeProvider>
    </>
  );
}
