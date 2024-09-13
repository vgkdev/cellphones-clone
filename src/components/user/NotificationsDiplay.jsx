import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import NotificationItem from "./NotificationItem";
import { markAllNotificationsAsRead } from "../../db/dbNotification";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { NOTIFICATION_STATUS } from "../../models/Notification";

export default function NotificationsDisplay({ userId, notis }) {
  const { showSnackbar } = useSnackbarUtils();
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(
      userId,
      () => {
        console.log("All notifications marked as read");
      },
      (error) => {
        console.error("Error marking all notifications as read:", error);
        showSnackbar("Error marking all notifications as read", "error");
      }
    );
  };
  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="p" fontWeight={"bold"}>
          {"[" + notis.length + "] notifications"}
        </Typography>
        {notis.map((noti) => {
          return <NotificationItem noti={noti} key={noti.id} userId={userId} />;
        })}
        {notis.filter((noti) => noti.status === NOTIFICATION_STATUS.UNREAD)
          .length > 0 && (
          <Typography
            variant="p"
            color="primary"
            fontStyle={"italic"}
            sx={{
              cursor: "pointer",
              marginTop: "10px",
              textDecoration: "underline",
            }}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}
