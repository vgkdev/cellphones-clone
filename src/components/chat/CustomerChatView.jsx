import { Box, Hidden, ThemeProvider, Typography } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  InfoButton,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useEffect } from "react";
import { useState } from "react";
import { onChildAdded, onChildChanged, onValue, set } from "firebase/database";
import customerSupportIcon from "../../assets/icons/customer_support_icon.png";
import shopIcon from "../../assets/icons/appIcon.png";
import { Message as MessageModel } from "../../models/Message";
import { rtdb } from "../../config/firebase";
import {
  rtdbSendMessage,
  rtdbSetRoomState,
} from "../../rtdb/rtdbCustomerSupport";
import { toSimpleDateString } from "../../utils/date";
import { getMessagePosition } from "../../utils/stringHelper";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";

export default function CustomerChatView({ converRef, user, roomStateRef }) {
  const [messages, setMessages] = useState([]);
  const [roomState, setRoomState] = useState(null);
  const {showSnackbar} = useSnackbarUtils();

  const getTypingUserList = () => {
    if (!roomState) return [];

    return roomState.isTyping.filter((user) => user !== "Customer").join(", ");
  };  

  const handleSend = (message) => {
    if (!converRef) return;
    const msgModel = MessageModel.quickMsg(user, message);
    rtdbSendMessage(converRef, msgModel);
    handleRemoveTypingUser("Customer");
  };

  const handleAddTypingUser = async (user) => {
    if (!roomStateRef) return;
    if (roomState.isTyping === undefined) {
      const newData = { ...roomState, isTyping: [user] };
      await rtdbSetRoomState(roomStateRef, newData);
      return;
    }

    if (roomState.isTyping?.includes(user)) return;
    const newData = { ...roomState, isTyping: [...roomState.isTyping, user] };
    await rtdbSetRoomState(roomStateRef, newData);
  };

  const handleRemoveTypingUser = async (user) => {
    if (!roomStateRef) return;
    if (roomState.isTyping === undefined) {
      return;
    }

    if (!roomState.isTyping?.includes(user)) return;
    const newData = {
      ...roomState,
      isTyping: roomState.isTyping.filter((u) => u !== user),
    };
    await rtdbSetRoomState(roomStateRef, newData);
  };

  useEffect(() => {
    if (converRef) {
      const unsub = onChildAdded(converRef, (snapshot) => {
        const msg = snapshot.val();
        setMessages((prev) => [...prev, msg]);
      });
      return () => unsub();
    }
  }, [converRef]);

  useEffect(() => {
    if (roomStateRef) {
      const unsub = onValue(roomStateRef, (snapshot) => {
        if(!snapshot.exists()) return showSnackbar("Chat is reset! Reload the page!", "warning");
        setRoomState(snapshot.val());
      });
      return () => unsub();
    }
  }, [roomStateRef]);

  if (!roomState) {
    return null;
  }
  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          overflow: "auto",
        }}
      >
        <ChatContainer
          style={{
            height: "500px",
            width: "400px",
          }}
        >
          <ConversationHeader>
            <Avatar name="Buy Phone One" src={shopIcon} />
            <ConversationHeader.Content
              info="We will contact you soon!"
              userName="Buy Phone One"
            />
            <ConversationHeader.Actions>
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList
            typingIndicator={
              roomState?.isTyping?.filter((user) => user !== "Customer")
                .length > 0 ? (
                <TypingIndicator
                  content={
                    "Staff is typing"
                  }
                />
              ) : null
            }
          >
            {messages?.map((msg, index) => (
              <Message
                key={index}
                model={{
                  direction: msg.sender === "Staff" ? "incoming" : "outgoing",
                  message: msg.message,
                  sender: msg.sender,
                  sentTime: toSimpleDateString(Date.now() - msg.sentTime),
                  position: getMessagePosition(messages, index),
                }}
              >
                {msg.sender === "Staff" && (
                  <Avatar name={msg.sender} src={customerSupportIcon} />
                )}
              </Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            autoFocus
            onSend={handleSend}
            onChange={(val) => {
              if (!roomStateRef) return;

              if (val.length > 0) {
                handleAddTypingUser("Customer");
              } else {
                handleRemoveTypingUser("Customer");
              }
            }}
          />
        </ChatContainer>
      </Box>
    </ThemeProvider>
  );
}
