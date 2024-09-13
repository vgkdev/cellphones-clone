import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../../theme/AppThemes";
import AppLogo from "../../assets/svg/AppLogo.svg";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import appIcon from "../../assets/icons/appIcon.png";
import DiscountIcon from "@mui/icons-material/Discount";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Breadcrumbs, Button, InputAdornment } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Grid";
import { getAllProducts } from "../../store/actions/productsAction";
import CloseIcon from "@mui/icons-material/Close";
import { priceFormatter } from "../../utils/stringHelper";
import AccountMenu from "./AccountMenu";
import { CART_COLLECTION, CART_PATH, getCartItemsCount } from "../../db/dbCart";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useLogout } from "../../db/dbUser";
import ProfileMenu from "./ProfileMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ORDER_COLLECTION } from "../../db/dbOrder";
import NotificationButton from "../user/NotificationButton";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.96),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "50%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    // [theme.breakpoints.up("md")]: {
    //   width: "40ch",
    // },
  },
  // border: "1px solid red",
}));

export function GeneratedListLink({ location }) {
  const paths = location.split("/").filter((path) => path !== "");

  return (
    <Box
      sx={{
        backgroundColor: "white",
      }}
      key={location}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        // width="100%"
        sx={{
          // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          // paddingLeft: "10px",
          padding: "0 20px",
        }}
        separator="⟶"
      >
        {paths.map((path, index) => {
          return index === 0 ? (
            <Link color="inherit" to="/shopping" key={index}>
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HomeIcon color="primary" />
                <Typography color="text.primary">Shop</Typography>
              </Box>
            </Link>
          ) : index !== paths.length - 1 ? (
            <Link
              color="inherit"
              to={`/${paths.slice(0, index + 1).join("/")}`}
              key={index}
            >
              <Typography color="text.primary">{path}</Typography>
            </Link>
          ) : (
            <Typography color="text.primary" key={index}>
              {path}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { products, loading, error } = useSelector((state) => state.products);

  const location = useLocation();
  const currentPath = location.pathname;

  // const isDashboardPage = location.pathname === "/dashboard";
  const isDashboardPage = currentPath.startsWith("/dashboard/");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [orderItemCount, setOrderItemCount] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const navigate = useNavigate();
  const logUserOut = useLogout();
  const { showSnackbar } = useSnackbarUtils();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    if(user === null) {
      setCartItemCount(0);
      setOrderItemCount(0);
      return;
    }
    if (!user?.id) return;
    const unsub = onSnapshot(doc(db, CART_PATH, user.id), (doc) => {
      const cart = doc.data();
      if (!cart) return;
      setCartItemCount(cart.products.length);
    });

    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = onSnapshot(
      query(ORDER_COLLECTION, where("userId", "==", user?.id)),
      (orders) => {
        console.log(">>>check get all order in nav bar: ", orders.size);
        setOrderItemCount(orders.size);
      }
    );

    return unsub;
  }, [user?.id]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSearchNavigate = () => {
    console.log(">>>check click history");
    if (searchTerm) {
      navigate(`/shopping/all-products?search=${searchTerm}`);
      handleClearSearchTerm();
    }
  };

  const handleClearSearchTerm = () => {
    setSearchTerm("");
    setFilteredProducts([]);
  };

  const handleProductClick = (product) => {
    console.log(">>>check click history");
    navigate(`/shopping/all-products/${product.id}`);

    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(product.id)) {
      searchHistory.push(product.id);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      setSearchHistory(searchHistory);
    }

    handleClearSearchTerm();
    setShowSearchResult(false);
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };

  const handleSearchInputClick = () => {
    if (searchHistory.length > 0) {
      setShowSearchResult(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSearchResult(false);
    }, 200);
  };

  const handleLogoutUser = () => {
    if (!user) {
      showSnackbar("You are not logged in", "error");
      return;
    }

    showSnackbar("Logging out...", "info");
    handleMenuClose();
    setTimeout(() => {
      logUserOut(
        () => {
          showSnackbar("Logged out successfully", "success");
        },
        () => {
          showSnackbar("Failed to log out", "error");
        }
      );
    }, 500);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <ProfileMenu
      anchorEl={anchorEl}
      onClose={() => {
        setAnchorEl(null);
      }}
    />
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // width: "80px",
            borderRadius: "10px",
            // backgroundColor: "#e44784",
          }}
        >
          <DiscountIcon />
        </IconButton>
        <p>Voucher</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // width: "80px",
            borderRadius: "10px",
            // backgroundColor: "#e44784",
          }}
          onClick={() => {
            navigate("shopping/cart");
          }}
        >
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem>
        <NotificationButton />
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // width: "100px",
            borderRadius: "10px",
            // backgroundColor: "#e44784",
          }}
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <ThemeProvider theme={violet_theme}>
      {!isDashboardPage && (
        <>
          <AppBar
            position="sticky"
            sx={{
              boxShadow: "none",
              height: "auto",
              display: "flex",
              justifyContent: "center",
              zIndex: "1000",
              top: 0,
            }}
          >
            <Toolbar
              sx={{
                background: "linear-gradient(to bottom, #F41414, #D3C7C7)",
                padding: "10px",
              }}
            >
              {/* Icon and name website */}
              <Box
                onClick={() => {
                  navigate("shopping/homepage");
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "auto",
                  cursor: "pointer",
                  // border: "1px solid blue",
                }}
              >
                <img
                  src={appIcon}
                  alt="app icon"
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <img
                    src={AppLogo}
                    alt="App Logo"
                    style={{
                      width: "200px",
                      marginRight: "10px",
                    }}
                  />
                </Box>
              </Box>

              {/* navigation and search bar */}
              <Box
                sx={{
                  display: { md: "flex", lg: "flex" },
                  alignItems: "center",
                  flexDirection: "row",
                  // border: "1px solid yellow",
                  width: "100%",
                }}
              >
                <Grid
                  container
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    // border: "1px solid blue",
                  }}
                >
                  <Grid item xs={12} md={7}>
                    <Search
                      sx={{
                        borderRadius: "50px",
                        width: "90% !important",
                      }}
                    >
                      <SearchIconWrapper onClick={handleSearchNavigate}>
                        <SearchIcon sx={{ color: "black" }} />
                      </SearchIconWrapper>
                      <StyledInputBase
                        sx={{ width: "100% !important" }}
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        // onClick={handleSearchInputClick}
                        onBlur={handleInputBlur}
                        onFocus={handleSearchInputClick}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            handleSearchNavigate();
                          }
                        }}
                        endAdornment={
                          searchTerm && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={handleClearSearchTerm}
                              >
                                <CloseIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      />
                      {/* {searchTerm && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "40px",
                            width: "100%",
                            maxHeight: "300px",
                            overflowY: "auto",
                            backgroundColor: "white",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                            zIndex: 10,
                            borderRadius: "4px",
                          }}
                        >
                          {filteredProducts.length === 0 ? (
                            <Box sx={{ padding: "10px" }}>
                              <Typography>No products found.</Typography>
                            </Box>
                          ) : (
                            filteredProducts.map((product) => (
                              <Box
                                key={product.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "10px",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      violet_theme.palette.primary.main,
                                      0.1
                                    ),
                                  },
                                }}
                                onClick={() => handleProductClick(product)}
                              >
                                <img
                                  src={product.displayImageUrl}
                                  alt={product.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                  }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    color="black"
                                  >
                                    {product.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                  >
                                    {priceFormatter.format(
                                      product.variantPrice[0]
                                    )}{" "}
                                    -{" "}
                                    {priceFormatter.format(
                                      product.variantPrice[
                                        product.variantPrice.length - 1
                                      ]
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                          )}
                        </Box>
                      )} */}
                      {(searchTerm || showSearchResult) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "40px",
                            width: "100%",
                            maxHeight: "300px",
                            overflowY: "auto",
                            backgroundColor: "white",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                            zIndex: 10,
                            borderRadius: "4px",
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {searchHistory.length > 0 && (
                            <Box
                              sx={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Search History
                                </Typography>
                                <Button
                                  variant="text"
                                  color="secondary"
                                  onClick={handleClearSearchHistory}
                                >
                                  Delete all
                                </Button>
                              </Box>
                              {searchHistory.map((productId) => {
                                const product = products.find(
                                  (p) => p.id === productId
                                );
                                if (!product) return null;
                                console.log(`history${productId}`);
                                return (
                                  <Box
                                    key={`history${productId}`}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "10px",
                                      cursor: "pointer",
                                      "&:hover": {
                                        backgroundColor: alpha(
                                          violet_theme.palette.primary.main,
                                          0.1
                                        ),
                                      },
                                    }}
                                    onClick={() => handleProductClick(product)}
                                  >
                                    <img
                                      src={product.displayImageUrl}
                                      alt={product.name}
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        marginRight: "10px",
                                      }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                      <Typography
                                        variant="body2"
                                        noWrap
                                        color="black"
                                      >
                                        {product.name}
                                      </Typography>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          )}
                          {filteredProducts.length === 0 ? (
                            <Box sx={{ padding: "10px" }}>
                              {/* <Typography>No products found.</Typography> */}
                            </Box>
                          ) : (
                            filteredProducts.map((product) => (
                              <Box
                                key={product.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "10px",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      violet_theme.palette.primary.main,
                                      0.1
                                    ),
                                  },
                                }}
                                onClick={() => handleProductClick(product)}
                              >
                                <img
                                  src={product.displayImageUrl}
                                  alt={product.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                  }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    color="black"
                                  >
                                    {product.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                  >
                                    {priceFormatter.format(
                                      product.finalPrices[0]
                                    )}{" "}
                                    -{" "}
                                    {priceFormatter.format(
                                      product.finalPrices[
                                        product.finalPrices.length - 1
                                      ]
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                          )}
                        </Box>
                      )}
                    </Search>
                  </Grid>

                  {/* menu */}
                  <Grid
                    item
                    md={5}
                    sx={{
                      // border: "1px solid blue",
                      display: { xs: "none", md: "flex" },
                      flexDirection: "row",
                    }}
                  >
                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // width: "80px",
                        borderRadius: "10px",
                        // backgroundColor: "#e44784",
                      }}
                      onClick={() => {
                        navigate("/shopping/voucher");
                      }}
                    >
                      <DiscountIcon />
                      <Typography variant="body2" sx={{ marginTop: "4px" }}>
                        Voucher
                      </Typography>
                    </IconButton>

                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // width: "80px",
                        borderRadius: "10px",
                        // backgroundColor: "#e44784",
                      }}
                      onClick={() => {
                        navigate("shopping/cart");
                      }}
                    >
                      <Badge badgeContent={cartItemCount} color="error">
                        <ShoppingCartIcon />
                      </Badge>

                      <Typography variant="body2" sx={{ marginTop: "4px" }}>
                        Cart
                      </Typography>
                    </IconButton>

                    {/* <IconButton
                      size="large"
                      aria-label={
                        "show " + unreadNotiCount + " new notifications"
                      }
                      color="inherit"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // width: "100px",
                        borderRadius: "10px",
                        // backgroundColor: "#e44784",
                      }}
                    >
                      <Badge badgeContent={unreadNotiCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                      <Typography variant="body2" sx={{ marginTop: "4px" }}>
                        Noti
                      </Typography>
                    </IconButton> */}
                    <NotificationButton />

                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // width: "100px",
                        borderRadius: "10px",
                        // backgroundColor: "#e44784",
                      }}
                      onClick={() => {
                        navigate("/shopping/orders");
                      }}
                    >
                      <Badge badgeContent={orderItemCount} color="error">
                        <LocalShippingIcon />
                      </Badge>
                      <Typography variant="body2" sx={{ marginTop: "4px" }}>
                        Orders
                      </Typography>
                    </IconButton>

                    <AccountMenu />
                  </Grid>
                </Grid>
              </Box>

              {/* <Box sx={{ flexGrow: 1 }} /> */}

              {/* view for mobile */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
            <GeneratedListLink location={currentPath} />
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </>
      )}
    </ThemeProvider>
  );
}
