import * as React from "react";

import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSelector } from "react-redux";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import personIcon from "../../assets/icons/person.png";
import { AdminPanelSettings } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useLogout } from "../../db/dbUser";
import ProfileMenu from "./ProfileMenu";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

// stolen from https://mui.com/components/menus/#customized-menus
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const user = useSelector((state) => state.user.user);
  const { showSnackbar } = useSnackbarUtils();
  const navigate = useNavigate();
  const logUserOut = useLogout();

  const handleLogoutUser = () => {
    if (!user) {
      showSnackbar("You are not logged in", "error");
      return;
    }

    showSnackbar("Logging out...", "info");
    handleClose();
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

  return (
    <div>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-haspopup="true"
        onClick={(event) => {
          if (!user) {
            navigate("shopping/sign-in");
          } else {
            handleClick(event);
          }
        }}
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
        {user ? (
          <Avatar
            alt={user.displayName}
            src={user.avatarImageUrl}
            sx={{ width: 24, height: 24 }}
          />
        ) : (
          <img
            src={personIcon}
            alt="person icon"
            style={{
              width: "25px",
            }}
          />
        )}

        {user?.isStaff || user?.isManager ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            flexDirection="row"
          >
            <AdminPanelSettings color={user.isManager ? "error" : "success"} />
            <Typography variant="caption">
              {user.isManager ? "Admin" : "Staff"}
            </Typography>
          </Box>
        ) : null}

        <Typography variant="body2" sx={{ marginTop: "4px" }}>
          {user ? user.displayName : "Login"}
        </Typography>
      </IconButton>
      {/* <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            navigate("shopping/edit-profile");
            handleClose();
          }}
          disableRipple
        >
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("shopping/user-setting");
            handleClose();
          }}
          disableRipple
        >
          <SettingsIcon />
          Setting
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogoutUser} disableRipple>
          <LogoutIcon />
          Logout
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <HighlightOffIcon />
          Close
        </MenuItem>
      </StyledMenu> */}
      <ProfileMenu anchorEl={anchorEl} onClose={handleClose} />
    </div>
  );
}
