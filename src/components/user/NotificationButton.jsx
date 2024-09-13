import {
  Badge,
  Box,
  DialogTitle,
  IconButton,
  Popover,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { onSnapshot } from "firebase/firestore";
import { getUserNotiCollection } from "../../db/dbNotification";
import { NOTIFICATION_STATUS } from "../../models/Notification";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsDisplay from "./NotificationsDiplay";

export default function NotificationButton() {
  const [unreadNotiCount, setUnreadNotiCount] = useState(0);
  const [userNotis, setUserNotis] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // State to store the anchor element for the popover
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) {
      setUnreadNotiCount(0);
      setUserNotis([]);
      return;
    }

    const unsub = onSnapshot(getUserNotiCollection(user.id), (snapshot) => {
      const notis = [];
      snapshot.forEach((doc) => {
        const noti = doc.data();
        notis.push(noti);
      });

      // sort by read status and then by date
      notis.sort((a, b) => {
        if (a.status === b.status) {
          return b.dalastUpdatete - a.lastUpdate;
        } else {
          return a.status === NOTIFICATION_STATUS.UNREAD ? -1 : 1;
        }
      });

      setUserNotis(notis);
      const unreadNotis = notis.filter(
        (noti) => noti.status === NOTIFICATION_STATUS.UNREAD
      );
      setUnreadNotiCount(unreadNotis.length);
    });

    return unsub;
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element to the clicked button
  };

  const handleClose = () => {
    setAnchorEl(null); // Clear the anchor element to hide the popover
  };

  const open = Boolean(anchorEl);

  return (
    <ThemeProvider theme={violet_theme}>
      <IconButton
        size="large"
        aria-label={"show " + unreadNotiCount + " new notifications"}
        color="inherit"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "10px",
        }}
        onClick={handleClick}
      >
        <Badge badgeContent={unreadNotiCount} color="error">
          <NotificationsIcon />
        </Badge>
        <Typography variant="body2" sx={{ marginTop: "4px" }}>
          Noti
        </Typography>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minWidth: "300px",
          }}
        >
          {/* <Typography sx={{ p: 2 }}>Notifications</Typography> */}
          {/* Content of the popover */}
          <NotificationsDisplay notis={userNotis} userId={user?.id}/>
        </Box>
      </Popover>
    </ThemeProvider>
  );
}
