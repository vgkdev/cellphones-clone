import * as React from "react";
import { styled, ThemeProvider, alpha } from "@mui/material/styles";

import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import StorageIcon from "@mui/icons-material/Storage";
import ProductIconOutlined from "../../../assets/svg/ProductIconOutlined.svg";
import { Button, Icon, snackbarClasses } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventIcon from "@mui/icons-material/Event";
import { violet_theme } from "../../../theme/AppThemes";
import { useNavigate } from "react-router-dom";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../../../db/dbUser";
import NotificationButton from "../../../components/user/NotificationButton";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: theme.palette.primary.dark,
  borderRadius: "10px",
  border: "5px solid #0000000F",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    backgroundColor: theme.palette.custom.dark,
    borderRadius: "10px",
    border: "5px solid #0000000F",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
    shadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
}));

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.2s ease-in-out",
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.light, 0.7),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.3),
  },
  "&.Mui-selected:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.7),
  },
  color: theme.palette.primary.contrastText,
  "&:active": {
    transform: "scale(0.95)",
  },
  borderRadius: theme.spacing(1),
}));

const viewportPages = [
  "dashboard",
  "products",
  "orders-management",
  "customers",
  "database-control",
  "events-management",
  "vouchers-managemnent",
  "accessories-management",
  "staffs",
  "customer-support",
];

export default function Dashboard({
  childComponent: Child,
  selectedIndex = 0,
}) {
  console.log(">>>check selected index: ", selectedIndex);
  const [open, setOpen] = React.useState(true);
  const [curNavIndex, setCurNavIndex] = React.useState(selectedIndex);
  const navigate = useNavigate();
  const logUserOut = useLogout(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenItemAtIndex = (index, navigate) => {
    navigate("/dashboard/" + viewportPages[index]);
    setCurNavIndex(index);
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <NotificationButton />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {/* Main Items List */}
            <CustomListItemButton
              selected={curNavIndex === 0}
              onClick={(e) => {
                handleOpenItemAtIndex(0, navigate);
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </CustomListItemButton>
            <CustomListItemButton
              selected={curNavIndex === 1}
              onClick={(e) => {
                handleOpenItemAtIndex(1, navigate);
              }}
            >
              <ListItemIcon>
                <Icon>
                  <img src={ProductIconOutlined} alt="ProductIconOutlined" />
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Phones" />
            </CustomListItemButton>

            <CustomListItemButton
              selected={curNavIndex === 7}
              onClick={(e) => {
                handleOpenItemAtIndex(7, navigate);
              }}
            >
              <ListItemIcon>
                <HeadphonesIcon />
              </ListItemIcon>
              <ListItemText primary="Phone accessories" />
            </CustomListItemButton>

            <CustomListItemButton
              selected={curNavIndex === 2}
              onClick={(e) => {
                handleOpenItemAtIndex(2, navigate);
              }}
            >
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </CustomListItemButton>

            <CustomListItemButton
              selected={curNavIndex === 3}
              onClick={(e) => {
                handleOpenItemAtIndex(3, navigate);
              }}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </CustomListItemButton>

            <CustomListItemButton
              selected={curNavIndex === 8}
              onClick={(e) => {
                handleOpenItemAtIndex(8, navigate);
              }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Staffs" />
            </CustomListItemButton>

            <CustomListItemButton
              selected={curNavIndex === 5}
              onClick={(e) => {
                handleOpenItemAtIndex(5, navigate);
              }}
            >
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </CustomListItemButton>

            <CustomListItemButton
              selected={curNavIndex === 6}
              onClick={(e) => {
                handleOpenItemAtIndex(6, navigate);
              }}
            >
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Vouchers" />
            </CustomListItemButton>
            {/* End of Main Items List */}
            <Divider
              sx={{
                my: 1,
                marginTop: 5,
                marginBottom: 5,
                bgcolor: (theme) => theme.palette.primary.contrastText,
                width: "100%",
                height: "2px",
              }}
            />
            {/* {secondaryListItems} */}
            <CustomListItemButton
              selected={curNavIndex === 4}
              onClick={(e) => {
                handleOpenItemAtIndex(4, navigate);
              }}
            >
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Database Control" />
            </CustomListItemButton>
            <Divider
              sx={{
                my: 1,
                marginTop: 5,
                marginBottom: 5,
                bgcolor: (theme) => theme.palette.primary.contrastText,
                width: "100%",
                height: "2px",
              }}
            />
            {/* {buttons} */}
            <CustomListItemButton
              selected={curNavIndex === 9}
              onClick={(e) => {
                handleOpenItemAtIndex(9, navigate);
              }}
            >
              <ListItemIcon>
                <HeadsetMicIcon />
              </ListItemIcon>
              <ListItemText primary="Customer Chat" />
            </CustomListItemButton>
            <CustomListItemButton
              component="a"
              href="/shopping"
              target="_blank"
            >
              <ListItemIcon>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText primary="Go to shop" />
            </CustomListItemButton>
          </List>

          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={() => {
                logUserOut();
              }}
            >
              Log out
            </Button>
            <Typography
              variant="body2"
              color={(theme) => theme.palette.primary.contrastText}
              align="center"
            >
              buyphone1.vn © 2021
            </Typography>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            background: "linear-gradient(to bottom, #FCD2D1, #D70019)",
            flexGrow: 1,
            // height: "100vh",
            overflow: "auto",
            borderRadius: "10px",
          }}
        >
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{
              mt: 4,
              mb: 4,
              borderRadius: "10px",
              border: "5px solid #0000000F",
              backgroundColor: violet_theme.palette.primary.contrastText,
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Child />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
