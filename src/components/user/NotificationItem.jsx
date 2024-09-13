import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Link,
  ThemeProvider,
  Typography,
  styled,
} from "@mui/material";
import { Notification } from "../../models/Notification";
import { violet_theme } from "../../theme/AppThemes";
import { toTruncatedString } from "../../utils/stringHelper";
import { NOTIFICATION_STATUS } from "../../models/Notification";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { toSimpleDateString } from "../../utils/date";
import { markNotificationAsRead } from "../../db/dbNotification";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useState } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function NotificationItem({ userId, noti }) {
  const { showSnackbar } = useSnackbarUtils();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleMarkAsRead = () => {
    if (noti.status === NOTIFICATION_STATUS.READ) return;
    markNotificationAsRead(
      userId,
      noti.id,
      () => {
        console.log("Notification marked as read");
      },
      (error) => {
        console.error("Error marking notification as read:", error);
        showSnackbar("Error marking notification as read", "error");
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            backgroundColor: (theme) => {
              if (noti.status === NOTIFICATION_STATUS.UNREAD) {
                return theme.palette.primary.contrastText;
              }
              return "white";
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 20,
                height: 20,
              }}
              alt="Notification Icon"
              src={noti.displayIcon}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "start",
                justifyContent: "start",
                width: "80%",
                gap: 1,
              }}
            >
              <Typography
                variant="p"
                color="primary"
                fontWeight={"bold"}
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleClickOpen();
                  handleMarkAsRead();
                }}
              >
                {"[" + noti.title + "]"}
              </Typography>
              <Typography variant="p" color="primary" fontStyle={"italic"}>
                {toTruncatedString(noti.content, 20)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              width: "100%",
              alignItems: "center",
              justifyContent: "end",
              pt: 1,
            }}
          >
            {noti.status === NOTIFICATION_STATUS.UNREAD && (
              <IconButton
                aria-label="Mark as read"
                size="small"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "10px",
                  padding: "5px", // Adjust padding to make the button smaller
                }}
                color="inherit"
                onClick={handleMarkAsRead}
              >
                <MarkEmailReadIcon fontSize="small" /> {/* Adjust icon size */}
              </IconButton>
            )}
            <Typography variant="p" fontSize={10}>
              {toSimpleDateString(noti.created)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {noti.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "20vw",
            height: "20vh",
          }}
        >
          <Typography>{noti.content}</Typography>
          <Typography>{noti.meta}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </ThemeProvider>
  );
}
