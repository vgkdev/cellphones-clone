import React, { useState, useEffect } from "react";
import { Button, Popover, Box, ThemeProvider } from "@mui/material";
import ChatSandbox from "./ChatSandbox";
import { violet_theme } from "../../theme/AppThemes";
import { ChatBubble } from "@mui/icons-material";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { showSnackbar } = useSnackbarUtils();
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("userAIMessages");
    if (savedMessages) {
      // showSnackbar("Welcome back! Your chat history is restored!", "success");
      return JSON.parse(savedMessages);
    } else {
      return [
        {
          message: "Hello, I'm BuyPhoneOne AI chatbot! Ask me anything!",
          sentTime: "just now",
          sender: "ChatGPT",
        },
        {
          message:
            "Let start with for example: 'Should I buy iPhone 13 or Samsung Galaxy S21?'",
          sentTime: "just now",
          sender: "ChatGPT",
        },
      ];
    }
  });

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    localStorage.setItem("userAIMessages", JSON.stringify(messages));
  }, [messages]);

  const chatBoxTop = window.innerHeight - 600;
  const chatBoxRight = window.innerWidth - 500;

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={toggleChat}
          startIcon={<ChatBubble />}
        >
          Chat AI
        </Button>
      </Box>
      <Popover
        open={isChatOpen}
        onClose={toggleChat}
        anchorReference="anchorPosition"
        anchorPosition={{ top: chatBoxTop, left: chatBoxRight }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <ChatSandbox messages={messages} setMessages={setMessages} />
      </Popover>
    </ThemeProvider>
  );
};

export default ChatButton;
