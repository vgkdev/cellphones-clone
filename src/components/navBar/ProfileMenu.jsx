import React from "react";
import { Divider, Menu, MenuItem } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../db/dbUser";
import LogoutIcon from "@mui/icons-material/Logout";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

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

const ProfileMenu = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
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
    onClose();
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
    <StyledMenu
      id="demo-customized-menu"
      MenuListProps={{
        "aria-labelledby": "demo-customized-button",
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem
        onClick={() => {
          navigate("shopping/edit-profile");
          onClose();
        }}
        disableRipple
      >
        <EditIcon />
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("shopping/user-setting");
          onClose();
        }}
        disableRipple
      >
        <SettingsIcon />
        Setting
      </MenuItem>

      {user && (user?.isManager || user?.isStaff) && (
        <MenuItem
          onClick={() => {
            navigate("/dashboard");
            onClose();
          }}
          disableRipple
        >
          <DashboardIcon />
          Go to Dashboard
        </MenuItem>
      )}

      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={handleLogoutUser} disableRipple>
        <LogoutIcon />
        Logout
      </MenuItem>
      <MenuItem onClick={onClose} disableRipple>
        <HighlightOffIcon />
        Close
      </MenuItem>
    </StyledMenu>
  );
};

export default ProfileMenu;
