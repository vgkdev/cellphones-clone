import * as React from "react";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Slide,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { violet_theme } from "../../theme/AppThemes";
import DiscountIcon from "@mui/icons-material/Discount";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PageNotFound from "../../components/PageNotFound";
import {
  decreaseItemQuantity,
  getCartById,
  increaseItemQuantity,
  removeItem,
  updateCart,
} from "../../db/dbCart";
import SimpleLoadingDisplay from "../../components/miscellaneous/SimpleLoadingDisplay";
import { getProductById } from "../../db/dbProduct";
import { getStockById } from "../../db/dbStock";
import CartPhoneItem from "./CartPhoneItem";
import botStudyImg from "../../assets/images/bot/study.png";
import { formatDateTime, priceFormatter } from "../../utils/stringHelper";
import { Link, useNavigate } from "react-router-dom";
import PlaceOrderItem from "./PlaceOrderItem";
import { ShoppingCart } from "@mui/icons-material";
import { getAllVouchers } from "../../db/dbVoucher";
import { DebounceTableSearch } from "mui-datatables";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ConfirmPlaceOrderSelectedItems({
  open,
  handleClose,
  onConfirm,
  products,
  stocks,
  voucher,
  total,
  quantities,
}) {
  return (
    <ThemeProvider theme={violet_theme}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm placing order"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            marginBottom={1}
            color="primary"
          >
            Seleted items
          </DialogContentText>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              gap: 2,
            }}
          >
            {products.map((product, index) => (
              <Box key={"selected-item-box-" + index} width={"100%"}>
                <Divider
                  sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
                />
                <Box key={"selected-item-" + index} width="100%">
                  <PlaceOrderItem
                    product={product}
                    stock={stocks[index]}
                    quantity={quantities[index]}
                  />
                </Box>
              </Box>
            ))}

            <Divider
              sx={{ bgcolor: "lightgray", width: "100%", height: "2px" }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography variant="p" fontWeight="bold">
                Voucher
              </Typography>
              <Typography variant="p">
                {voucher?.name ? voucher.name : "None"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography variant="p" fontWeight="bold">
                Discount
              </Typography>
              <Typography variant="p">
                {voucher
                  ? priceFormatter.format(
                      Math.min(
                        total * voucher.discountRate,
                        voucher.maxDiscount
                      )
                    )
                  : 0}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography variant="p" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="p" fontWeight={"bold"} fontStyle={"italic"}>
                {priceFormatter.format(total)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              onConfirm();
              handleClose();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export function VoucherListModal({
  open,
  vouchers,
  handleClose,
  handleVoucherSelect,
  products,
  selectedItemIndices,
}) {
  const [selectedVoucher, setSelectedVoucher] = React.useState(null);
  const [applicableProductsMap, setApplicableProductsMap] = React.useState({});

  // console.log(">>>check selected item: ", selectedItemIndices);
  // console.log(">>>check all products: ", products);
  // selectedItemIndices.map((value, index) => {
  //   console.log(">>>check selected products: ", products[value]);
  // });

  React.useEffect(() => {
    const productsMap = [];
    vouchers.forEach((voucher) => {
      voucher.applicableProducts.forEach((productId) => {
        if (!productsMap.includes(productId)) {
          productsMap.push(productId);
        }
      });
    });
    setApplicableProductsMap(productsMap);
  }, [vouchers]);

  const handleToggle = (voucher) => {
    if (selectedVoucher && selectedVoucher.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
  };

  const handleConfirm = () => {
    handleVoucherSelect(selectedVoucher ? selectedVoucher : null);
    handleClose();
  };

  const isVoucherApplicable = (voucher) => {
    // console.log(">>>check voucher: ", voucher.id);
    // console.log(">>>check applicableProductsMap: ", applicableProductsMap);
    if (selectedItemIndices.length === 0) {
      return false;
    }

    const selectedProductIds = selectedItemIndices.map(
      (index) => products[index].id
    );

    // console.log(">>>check selectedProductIds: ", selectedProductIds);
    return selectedProductIds.every((productId) =>
      voucher.applicableProducts.includes(productId)
    );
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Danh sách mã khuyến mãi</DialogTitle>
        <DialogContent>
          <List>
            {vouchers.map((voucher, index) => (
              <ListItemButton
                key={voucher.id}
                onClick={() => handleToggle(voucher)}
                selected={selectedVoucher && selectedVoucher.id === voucher.id}
                sx={{
                  opacity: isVoucherApplicable(voucher) ? 1 : 0.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar src={voucher.iconImageUrl} alt={voucher.name} />
                </ListItemAvatar>
                <Box ml={2} flexGrow={1}>
                  <Typography variant="h6">{voucher.name}</Typography>
                  <Typography variant="body2">
                    Hạn sử dụng:{" "}
                    <strong>{formatDateTime(voucher.endTime)}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Điều kiện: tối thiểu{" "}
                    <strong>
                      {priceFormatter.format(voucher.discountThreshold)}
                    </strong>
                  </Typography>
                  <Typography variant="body2">
                    Giảm đến <strong>{voucher.discountRate * 100}%</strong> (Tối
                    đa{" "}
                    <strong>
                      {priceFormatter.format(voucher.maxDiscount)}
                    </strong>
                    )
                  </Typography>
                  <Typography variant="body2">
                    Số lượng còn lại:{" "}
                    <strong>{voucher.maxUse - voucher.currentUse}</strong>
                  </Typography>
                </Box>
                <Checkbox
                  checked={selectedVoucher?.id === voucher.id || false}
                  tabIndex={-1}
                  disableRipple
                  disabled={!isVoucherApplicable(voucher)}
                  sx={{
                    "&.Mui-disabled": {
                      pointerEvents: "none",
                      opacity: 0,
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default function CartPage() {
  const { showSnackbar } = useSnackbarUtils();
  const [products, setProducts] = React.useState(null);
  const [stocks, setStocks] = React.useState(null);
  const [cart, setCart] = React.useState(null); // [ {product, stock, quantity}
  const user = useSelector((state) => state.user.user);
  const [openConfirmRemoveDialog, setOpenConfirmRemoveDialog] =
    React.useState(false);
  const [removingIndex, setRemovingIndex] = React.useState(-1);
  const [selectedItemIndices, setSelectedItemIndices] = React.useState([]);
  const [isOpenConfirmPlacedOrder, setIsOpenConfirmPlacedOrder] =
    React.useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = React.useState(false);
  const [availableVouchers, setAvailableVouchers] = React.useState([]);
  const [selectedVoucher, setSelectedVoucher] = React.useState("");
  const [voucherCode, setVoucherCode] = React.useState("");

  const navigate = useNavigate();

  const setSelectedItemAtIndex = (index, value) => {
    if (value) {
      setSelectedItemIndices([...selectedItemIndices, index]);
      setVoucherCode("");

      setSelectedVoucher("");
    } else {
      setSelectedItemIndices(selectedItemIndices.filter((i) => i !== index));
      setVoucherCode("");
      setSelectedVoucher("");
    }
  };

  const selectAllItems = () => {
    setSelectedItemIndices([...Array(products.length).keys()]);
    setVoucherCode("");
    setSelectedVoucher("");
  };

  const getAllStocksAndProducts = async () => {
    if (!cart) {
      return;
    }

    let products = [];
    let stocks = [];

    for (const productId of cart.products) {
      await new Promise((resolve, reject) => {
        getProductById(
          productId,
          (p) => {
            products.push(p);
            resolve();
          },
          (error) => {
            showSnackbar("Error getting product: " + error, "error");
            reject(error);
          }
        );
      });
    }

    for (let index = 0; index < products.length; index++) {
      await new Promise((resolve, reject) => {
        getStockById(
          products[index].id,
          cart.stockIds[index],
          (s) => {
            stocks.push(s);
            resolve();
          },
          (error) => {
            showSnackbar("Error getting stock: " + error, "error");
            reject(error);
          }
        );
      });
    }

    setProducts(products);
    setStocks(stocks);
  };

  const handleIncreaseQuantity = (index) => {
    console.log("increase quantity", index);
    increaseItemQuantity(
      cart,
      index,
      (cart) => {
        setCart(cart);
        console.log("increased quantity", cart);
      },
      (error) => {
        showSnackbar("Error increasing quantity: " + error, "error");
      }
    );
  };

  const handleDecreaseQuantity = async (index) => {
    console.log("decrease quantity", index);
    try {
      await decreaseItemQuantity(
        cart,
        index,
        (cart) => {
          setCart(cart);
          console.log("decreased quantity", cart);
        },
        (error) => {
          showSnackbar("Error decreasing quantity: " + error, "error");
        }
      );
    } catch (e) {
      if (e.message === "-1") {
        setOpenConfirmRemoveDialog(true);
        setRemovingIndex(index);
      } else {
        showSnackbar("Error decreasing quantity: " + e.message, "error");
      }
    }
  };

  const handleRemoveItem = (index) => {
    console.log("remove item", index);
    removeItem(
      cart,
      index,
      (cart) => {
        setCart(cart);
        setProducts(products.filter((_, i) => i !== index));
        setStocks(stocks.filter((_, i) => i !== index));
        const newSelectedItems = selectedItemIndices.filter((i) => i !== index);
        // update selected indices by shifting the indices
        newSelectedItems.forEach((i, j) => {
          if (i > index) {
            newSelectedItems[j] = i - 1;
          }
        });
        setSelectedItemIndices(newSelectedItems);
        setVoucherCode("");
        setSelectedVoucher("");
        console.log("removed item", cart);
      },
      (error) => {
        showSnackbar("Error removing item: " + error, "error");
      }
    );
  };

  const handleCloseConfirmRemoveDialog = () => {
    setOpenConfirmRemoveDialog(false);
  };

  const handleRemoveSelectedItems = () => {
    console.log("remove selected items", selectedItemIndices);
    const indicesToRemove = selectedItemIndices;
    const cartData = { ...cart };

    cartData.products = cartData.products.filter(
      (_, i) => !indicesToRemove.includes(i)
    );
    cartData.productsQuantity = cartData.productsQuantity.filter(
      (_, i) => !indicesToRemove.includes(i)
    );
    cartData.stockIds = cartData.stockIds.filter(
      (_, i) => !indicesToRemove.includes(i)
    );

    updateCart(
      cartData,
      (cart) => {
        setCart(cart);
        setSelectedItemIndices([]);
        setVoucherCode("");
        setSelectedVoucher("");

        setProducts(products.filter((_, i) => !indicesToRemove.includes(i)));
        setStocks(stocks.filter((_, i) => !indicesToRemove.includes(i)));
        console.log("removed selected items", cart);
      },
      (error) => {
        showSnackbar("Error removing selected items: " + error, "error");
      }
    );
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    getCartById(
      user.id,
      (cart) => {
        setCart(cart);
      },
      (error) => {
        showSnackbar("Error getting cart: " + error, "error");
      }
    );
  }, [user?.id]);

  const handlePlaceOrder = () => {
    // showSnackbar("Order Placed");
    //#TODO: fancy order placement success
    navigate("/shopping/checkout", {
      state: {
        products: products.filter((_, i) => selectedItemIndices.includes(i)),
        stocks: stocks.filter((_, i) => selectedItemIndices.includes(i)),
        quantities: selectedItemIndices.map((i) => cart.productsQuantity[i]),
        cart: cart,
        total:
          calcTotalProductsPrice() - calcDiscount(calcTotalProductsPrice()),
        voucher: null,
        cartItemIndices: selectedItemIndices,
      },
    });
  };

  const handleApplyVoucher = () => {
    setIsVoucherModalOpen(true);
  };

  const handleVoucherSelect = (voucher) => {
    // console.log(">>>check vouchers selected: ", voucher.code);
    setSelectedVoucher(voucher);
    setVoucherCode(voucher?.code ? voucher.code : "");
    setIsVoucherModalOpen(false);
  };

  const hanleApplyVoucherCode = () => {
    const voucherIndex = availableVouchers.findIndex(
      (voucher) => voucher.code === voucherCode
    );

    if (voucherIndex === -1) {
      setSelectedVoucher("");
      showSnackbar("Voucher not available!", "error");
      return;
    }

    // console.log(">>>check include: ", availableVouchers[voucherIndex]);

    const selectedProductIds = selectedItemIndices.map(
      (index) => products[index].id
    );

    // console.log(">>>check selectedProductIds: ", selectedProductIds);
    const check = selectedProductIds.every((productId) =>
      availableVouchers[voucherIndex].applicableProducts.includes(productId)
    );

    // console.log(check);
    if (check) {
      setSelectedVoucher(availableVouchers[voucherIndex]);
      showSnackbar("Voucher applied successfully", "success");
    }
  };

  const calcTotalProductsPrice = () => {
    return selectedItemIndices.reduce(
      (acc, index) =>
        acc +
        products[index].finalPrices[stocks[index].variantIndex] *
          cart.productsQuantity[index],
      0
    );
  };

  const calcDiscount = (total) => {
    if (selectedVoucher) {
      return Math.min(
        total * selectedVoucher.discountRate,
        selectedVoucher.maxDiscount
      );
    }
    return 0;
  };

  useEffect(() => {
    if (!cart) {
      return;
    }
    // save firebase calls
    if (products && stocks) {
      return;
    }

    getAllStocksAndProducts();
  }, [cart]);

  useEffect(() => {
    getAllVouchers(
      (vouchers) => {
        const vouchersOfUser = vouchers.filter((voucher) =>
          user.collectedVouchers.includes(voucher.id)
        );

        // console.log(">>>check vouchersOfUser: ", vouchersOfUser);

        setAvailableVouchers(vouchersOfUser);
      },
      (error) => {
        console.error("Error fetching vouchers: ", error);
        // showSnackbar("Error fetching vouchers: " + error, "error");
      }
    );
  }, []);

  if (!cart || !stocks || !products) {
    return <SimpleLoadingDisplay />;
  }

  if (!user) {
    return <PageNotFound />;
  }

  if (products.length === 0) {
    return (
      <ThemeProvider theme={violet_theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="primary">
            Your cart is empty
          </Typography>
          <img src={botStudyImg} alt="bot study" width="200" height="200" />
          <Button
            startIcon={<ShoppingCart />}
            variant="contained"
            color="primary"
            onClick={() => navigate("/shopping/all-products")}
          >
            Go to shop
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: "start",
            justifyContent: "start",
            width: {
              sm: "100%",
              md: "80%",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "space-between",
              width: {
                sm: "100%",
                md: "60%",
              },
            }}
          >
            <Typography variant="h6" color="primary" marginBottom={5}>
              Shopping Cart
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "start",
                width: "100%",
              }}
              marginBottom={2}
            >
              <Checkbox
                color="primary"
                checked={selectedItemIndices.length === products.length}
                onChange={() => {
                  if (selectedItemIndices.length === products.length) {
                    setSelectedItemIndices([]);
                    setVoucherCode("");
                    setSelectedVoucher("");
                  } else {
                    selectAllItems();
                  }
                }}
              />
              <Typography>Select All</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
              marginBottom={2}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: 1,
                }}
              >
                <Typography color="primary" fontWeight="bold">
                  {selectedItemIndices.length}
                </Typography>

                <Typography marginLeft={1}>items selected </Typography>
              </Box>
              {selectedItemIndices.length !== 0 && (
                <Link onClick={handleRemoveSelectedItems}>
                  <Typography color="primary">Remove selected items</Typography>
                </Link>
              )}
            </Box>

            <Divider
              sx={{ bgcolor: "lightgray", width: "90%", height: "2px" }}
            />

            {products.map((product, index) => (
              <Box key={"cart-phone-item-" + index} width="100%">
                {index > 0 && (
                  <Divider
                    sx={{
                      bgcolor: "lightgray",
                      width: "90%",
                      height: "2px",
                      marginBottom: 2,
                    }}
                  />
                )}
                <CartPhoneItem
                  product={product}
                  stock={stocks[index]}
                  quantity={cart.productsQuantity[index]}
                  index={index}
                  onQuantityIncrease={() => handleIncreaseQuantity(index)}
                  onQuantityDecrease={() => handleDecreaseQuantity(index)}
                  onRemove={() => handleRemoveItem(index)}
                  selected={selectedItemIndices.includes(index)}
                  setSelected={setSelectedItemAtIndex}
                />
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "start",
              width: {
                sm: "100%",
                md: "40%",
              },
              border: "1px solid gray",
              borderRadius: 3,
              gap: 2,
            }}
            padding={2}
          >
            <Typography
              variant="h6"
              color="primary"
              marginTop={2}
              marginBottom={2}
            >
              Order
            </Typography>

            <Typography>Discount code/ Promo code</Typography>

            <TextField
              id="outlined-basic"
              label="Enter Code"
              variant="outlined"
              disabled={selectedItemIndices.length === 0}
              fullWidth
              value={voucherCode}
              onChange={(event) => {
                setVoucherCode(event.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={hanleApplyVoucherCode}
                      disabled={selectedItemIndices.length === 0}
                    >
                      use
                    </Button>
                  </InputAdornment>
                ),
              }}
            />

            {/* choose from list vouchers*/}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleApplyVoucher}
              disabled={selectedItemIndices.length === 0}
              startIcon={<DiscountIcon />}
            >
              Apply Voucher
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>
                {priceFormatter.format(calcTotalProductsPrice())}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>Discount</Typography>
              <Typography>
                {priceFormatter.format(calcDiscount(calcTotalProductsPrice()))}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>Total</Typography>
              <Typography>
                {priceFormatter.format(
                  calcTotalProductsPrice() -
                    calcDiscount(calcTotalProductsPrice())
                )}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              disabled={selectedItemIndices.length === 0}
              onClick={() => {
                if (selectedItemIndices.length === 0) {
                  showSnackbar("Please select items to place order", "error");
                  return;
                }

                setIsOpenConfirmPlacedOrder(true);
              }}
              fullWidth
              sx={{
                p: 2,
              }}
            >
              Place Order
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={openConfirmRemoveDialog}
        onClose={handleCloseConfirmRemoveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color={"red"}>
          {"Confirm removing item from cart"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to remove this item from the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmRemoveDialog} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            autoFocus
            variant="contained"
            onClick={() => {
              handleRemoveItem(removingIndex);
              setRemovingIndex(-1);
              setOpenConfirmRemoveDialog(false);
            }}
          >
            Remove item
          </Button>
        </DialogActions>
      </Dialog>

      <VoucherListModal
        open={isVoucherModalOpen}
        vouchers={availableVouchers}
        handleClose={() => setIsVoucherModalOpen(false)}
        handleVoucherSelect={handleVoucherSelect}
        products={products}
        selectedItemIndices={selectedItemIndices}
      />

      <ConfirmPlaceOrderSelectedItems
        open={isOpenConfirmPlacedOrder}
        handleClose={() => setIsOpenConfirmPlacedOrder(false)}
        onConfirm={() => {
          setIsOpenConfirmPlacedOrder(false);
          handlePlaceOrder();
        }}
        products={products.filter((_, i) => selectedItemIndices.includes(i))}
        stocks={stocks.filter((_, i) => selectedItemIndices.includes(i))}
        voucher={selectedVoucher}
        total={
          calcTotalProductsPrice() - calcDiscount(calcTotalProductsPrice())
        }
        quantities={selectedItemIndices.map((i) => cart.productsQuantity[i])}
      />
    </ThemeProvider>
  );
}
