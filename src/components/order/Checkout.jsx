import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import { ThemeProvider } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AddressForm from "./AddressForm";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import PaymentForm from "./PaymentForm";
import ReviewOrder from "./ReviewOrder";
import { violet_theme } from "../../theme/AppThemes";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Order } from "../../models/Order";
import { getNextOrderKey, useCreateOrder } from "../../db/dbOrder";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useEffect } from "react";
import { priceFormatter } from "../../utils/stringHelper";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";
import { removeMultipleItemsFromCart } from "../../db/dbCart";
import { Backdrop, CircularProgress } from "@mui/material";
import { set } from "firebase/database";
import NothingHerePage from "../../pages/shopping/NothingHerePage";

export default function Checkout({ shipFee = 50000 }) {
  const { showSnackbar } = useSnackbarUtils();
  const [activeStep, setActiveStep] = React.useState(0);
  const [userAddress, setUserAddress] = React.useState({
    name: "",
    phoneNumber: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    address: "",
    isFormComplete: false,
  });
  const user = useSelector((state) => state.user?.user || null);
  const [order, setOrder] = React.useState(new Order());
  const navigate = useNavigate();

  const location = useLocation();
  const data = location.state;

  const handleNext = () => {
    activeStep === steps.length - 1
      ? pushOrderToDB()
      : setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddressChange = (newAddress) => {
    setUserAddress(newAddress);
    setOrder({ ...order, ...newAddress });
  };

  const createOrder = useCreateOrder();

  const pushOrderToDB = async () => {
    console.log("Push order to DB");
    console.log(order);
    createOrder(
      order,
      async (order) => {
        // Make this function async
        console.log("Order created: ", order);
        if (
          data.cartItemIndices !== undefined &&
          data.cartItemIndices &&
          data.cart
        ) {
          await removeMultipleItemsFromCart(
            data.cart,
            data.cartItemIndices,
            (cart) => {
              console.log("Cart after remove: ", cart);
            },
            (error) => {
              console.log("Failed to remove items from cart: ", error);
            }
          );
        }

        showSnackbar("Placing order...", "info");
        handleOpen();
        setTimeout(() => {
          handleClose();
          showSnackbar("Đặt hàng thành công!", "success", true);
          setActiveStep(activeStep + 1);
        }, 2000);
      },
      (error) => {
        showSnackbar("Failed to create order: " + error, "error", true);
      }
    );
  };

  const steps = [
    "Địa chỉ giao hàng",
    "Phương thức thanh toán",
    "Xác nhận đơn hàng",
  ];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            userAddress={userAddress}
            onAddressChange={handleAddressChange}
          />
        );
      case 1:
        return <PaymentForm orderKey={order.phoneNumber + " " + order.key} />;
      case 2:
        return <ReviewOrder order={order} />;
      default:
        throw new Error("Unknown step");
    }
  }

  // backdrop:
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if(!data){ return; }
    if(order.key!==""){ return; }
    console.log(">>> Checkout data:");
    console.log(data);
    getNextOrderKey(
      (key) => {
        const productNames = data.stocks.map(
          (stock, i) =>
            data.products[i].name +
            " " +
            data.products[i].variantName[stock.variantIndex] +
            " "
        );

        const productDescriptions = data.stocks.map(
          (stock, i) => (data.products[i].usages.join(", "), stock.color)
        );

        const productPrices = data.stocks.map(
          (stock, i) => data.products[i].finalPrices[stock.variantIndex]
        );

        order.totalProductPrice = data.total;

        order.total = order.totalProductPrice + shipFee;

        order.shipFee = shipFee;

        order.products = data.products.map((product) => product.id);
        order.stockIds = data.stocks.map((stock) => stock.id);
        order.quantities = data.quantities;
        order.voucherId = data.voucher?.id || "";
        order.userId = user?.id || "";

        // #TODO: check calculate total price

        setOrder({
          ...order,
          key: key,
          productNames: productNames,
          productDescriptions: productDescriptions,
          productPrices: productPrices,
        });
      },
      (error) => {
        showSnackbar("Failed to get order key: " + error, "error", true);
      }
    );
  }, [order.key]);

  if(!data){
    return <NothingHerePage />;
  }

  if (order.key === "") {
    return <SimpleLoadingDisplay />;
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <CssBaseline />
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: 150,
            }}
          >
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              href="/shopping/cart"
              sx={{ ml: "-8px" }}
            >
              Trở về
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info
              totalPrice={
                activeStep >= 2 ? order.total : order.totalProductPrice
              }
              order={order}
            />
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
                height: 150,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: "100%",
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-of-type": { pl: 0 },
                      ":last-child": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                ":last-child": { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Sản phẩm đã chọn
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 2
                    ? priceFormatter.format(order.total)
                    : priceFormatter.format(order.totalProductPrice)}
                  đ
                </Typography>
              </div>
              <InfoMobile
                totalPrice={
                  activeStep >= 2 ? order.total : order.totalProductPrice
                }
              />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-child": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Đặt hàng thành công!</Typography>
                <Typography variant="body1" color="text.secondary">
                  {" Mã đơn hàng của bạn là  "}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigator.clipboard.writeText(order.id);
                      showSnackbar("Đã sao chép mã đơn hàng", "success");
                    }}
                  >
                    <strong>&nbsp;#{order.id}</strong>
                  </Button>
                  . Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: "start",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  onClick={() => {
                    handleOpen();
                    setTimeout(() => {
                      navigate("/shopping/orders");
                    }, 1000);
                  }}
                >
                  Đi đến trang đơn hàng
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "10px",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      Quay lại
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      Quay lại
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    sx={{
                      width: { xs: "100%", sm: "fit-content" },
                    }}
                    disabled={activeStep === 0 && !userAddress.isFormComplete}
                  >
                    {activeStep === steps.length - 1 ? "Đặt hàng" : "Tiếp tục"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
