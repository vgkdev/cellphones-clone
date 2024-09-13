import { Button, IconButton, ThemeProvider } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useState } from "react";
import {
  rtdbGetCoversationRef,
  rtdbGetRoomStateRef,
  rtdbSendMessage,
} from "../../rtdb/rtdbCustomerSupport";
import { useSelector } from "react-redux";
import { Message } from "../../models/Message";
import ChatPopper from "./ChatPopper";

export default function CustomerSupportButton() {
  const { showSnackbar } = useSnackbarUtils();
  const [converRef, setConverRef] = useState(null);
  const [roomStateRef, setRoomStateRef] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleGetConversation = async () => {
    const res = await rtdbGetCoversationRef(user);
    const roomState = await rtdbGetRoomStateRef(user);
    setConverRef(res);
    setRoomStateRef(roomState);
    showSnackbar("Customer support is ready!", "success");
    console.log(">>>conversation: ", res);
  };

  const sendHelloMessage = async () => {
    if (!converRef) return showSnackbar("Something went wrong!", "error");
    try {
      await rtdbSendMessage(
        converRef,
        Message.quickMsg(user, "Hello! I need help!")
      );
      showSnackbar("Message sent!", "success");
    } catch (error) {
      showSnackbar("Failed to send message :(", "error");
      console.error("Failed to send message:", error);
    }
  };

  const handleOpen = (e)=>{
    setAnchorEl(e.currentTarget);
    setOpen(!open);
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Button
        startIcon={<SupportAgentIcon />}
        variant="contained"
        color="primary"
        onClick={(e) => {
          if (!converRef) {
            handleGetConversation();
          }
          handleOpen(e);
        }}
      >
        Customer Support
      </Button>
      <ChatPopper
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        open={open}
        setOpen={setOpen}
        converRef={converRef}
        user={user}
        roomStateRef={roomStateRef}
      />
    </ThemeProvider>
  );
}
