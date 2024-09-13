import { useState } from "react";
import { Notification } from "../../models/Notification";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { useEffect } from "react";
import { getAllDefaultNotificationIcons } from "../../db/storageImage";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { addNotification } from "../../db/dbNotification";
import { Send } from "@mui/icons-material";

export default function SendUserNotificationForm({ notiId, userId }) {
  const { showSnackbar } = useSnackbarUtils();
  const [notification, setNotification] = useState(new Notification().data());
  const [notificationIcons, setNotificationIcons] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification({ ...notification, [name]: value });
  };

  useEffect(() => {
    getAllDefaultNotificationIcons(
      (icons) => {
        setNotificationIcons(icons);
      },
      (error) => {
        console.error("Error fetching notification icons:", error);
      }
    );
  }, []);

  const handleSendNotification = () => {
    addNotification(
      userId,
      notification,
      (notiId) => {
        console.log("Notification sent successfully with ID:", notiId);
        showSnackbar("Notification sent successfully", "success");
      },
      (error) => {
        console.error("Failed to send notification:", error);
        showSnackbar("Failed to send notification", "error");
      }
    );
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box width="100%" display="flex" flexDirection={"column"}
      gap={2}
      >
        <TextField
          name="title"
          label="Title"
          value={notification.title}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
        />

        <TextField
          name="content"
          label="Content"
          value={notification.content}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
        />

        <Select
          value={notification.displayIcon}
          onChange={handleInputChange}
          inputProps={{
            name: "displayIcon",
          }}
        >
          <MenuItem value="">None</MenuItem>
          {notificationIcons.map((icon, index) => (
            <MenuItem key={index} value={icon}>
              <img
                key={index}
                src={icon}
                alt="icon"
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </MenuItem>
          ))}
        </Select>

        <TextField
          name="meta"
          label="Meta"
          value={notification.meta}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
        />

        <Button startIcon={<Send/>} variant="contained" onClick={handleSendNotification}>
          Send
        </Button>
      </Box>
    </ThemeProvider>
  );
}
