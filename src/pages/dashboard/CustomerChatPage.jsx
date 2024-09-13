import { ThemeProvider, Typography } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import * as React from "react";

import Dashboard from "../components/dashboard/Dashboard";
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  ExpansionPanel,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  Search,
  Sidebar,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { useEffect } from "react";
import {
  rtdbGetCustomerSupportRef,
  rtdbGetRoomStateRef,
  rtdbSendMessage,
  rtdbSetRoomState,
  rtdbTryToGetConverRef,
  rtdbTryToGetRoomStateRef,
} from "../../rtdb/rtdbCustomerSupport";
import { onValue } from "firebase/database";
import { getMessagePosition } from "../../utils/stringHelper";
import {
  toDifferenceDayTimeToNow,
  toSimpleDateString,
  toSimpleDateTimeString,
} from "../../utils/date";
import { Message as MessageModel } from "../../models/Message";
import { useSelector } from "react-redux";

function ViewPort() {
  const [clientList, setClientList] = useState([]);
  const [curClient, setCurClient] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [runAlready, setRunAlready] = useState(false);
  const staffId = user ? user.id : "";

  const addClient = (clients, client, isAuthenticated = false) => {
    let messages = [];
    if (client.conversation !== undefined) {
      for (let [key, value] of Object.entries(client.conversation)) {
        messages.push(value);
      }
    }

    clients.push({
      ...client,
      isAuthenticated: isAuthenticated,
      messages: messages,
    });
  };

  const findClientIndex = (chatId) => {
    for (let i = 0; i < clientList.length; i++) {
      if (clientList[i].roomStatus?.chatId === chatId) {
        return i;
      }
    }

    return -1;
  };

  const isCustomerTyping = (client) => {
    if (!client) return false;
    if (client.roomStatus?.isTyping === undefined) return false;
    return client.roomStatus?.isTyping.includes("Customer");
  };

  const handleSendMessageToClient = async (client, content) => {
    if (!client || !client.roomStatus) return;
    const clientConversationRef = rtdbTryToGetConverRef(
      client.roomStatus.chatId,
      client.isAuthenticated
    );
    const msgModel = MessageModel.quickStaffMsg(content, staffId);
    await rtdbSendMessage(clientConversationRef, msgModel);
    await handleRemoveTypingUser("Staff");
  };

  const currentId = curClient
    ? curClient.roomStatus
      ? curClient.roomStatus.chatId
      : null
    : null;

  const handleAddTypingUser = async (user) => {
    if (!curClient || !curClient.roomStatus || !curClient.roomStatus.chatId)
      return;
    const roomStateRef = rtdbTryToGetRoomStateRef(
      curClient.roomStatus.chatId,
      curClient.isAuthenticated
    );
    if (!roomStateRef) return;

    const newData =
      curClient.roomStatus.isTyping === undefined
        ? {
            ...curClient.roomStatus,
            isTyping: [user],
          }
        : {
            ...curClient.roomStatus,
            isTyping: [...curClient.roomStatus.isTyping, user],
          };
    await rtdbSetRoomState(roomStateRef, newData);
  };

  const handleRemoveTypingUser = async (user) => {
    if (!curClient || !curClient.roomStatus || !curClient.roomStatus.chatId)
      return;
    const roomStateRef = rtdbTryToGetRoomStateRef(
      curClient.roomStatus.chatId,
      curClient.isAuthenticated
    );
    if (!roomStateRef) return;

    if (curClient.roomStatus.isTyping === undefined) return;

    const newData = {
      ...curClient.roomStatus,
      isTyping: curClient.roomStatus.isTyping.filter((u) => u !== user),
    };

    await rtdbSetRoomState(roomStateRef, newData);
  };

  useEffect(() => {
    const customerSupportRef = rtdbGetCustomerSupportRef();
    console.log("I'm still running lol");
    const unsub = onValue(customerSupportRef, (snapshot) => {
      setRunAlready(true);
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const authenticatedChats = data.authenticatedChats;
      const unauthenticatedChats = data.unauthenticatedChats;
      const clients = [];
      if (authenticatedChats) {
        for (let [key, value] of Object.entries(authenticatedChats)) {
          addClient(clients, value, true);
        }
      }

      if (unauthenticatedChats) {
        for (let [key, value] of Object.entries(unauthenticatedChats)) {
          addClient(clients, value);
        }
      }

      if (clients.length > 0) {
        if (!currentId) {
          // debugger;
          setCurClient({ ...clients[0] });
        } else {
          const index = findClientIndex(currentId);
          if (index === -1) {
            // debugger;
            setCurClient(null);
          } else {
            // debugger;
            setCurClient({ ...clients[index] });
          }
        }
      }
      setClientList(clients);
    });
    return () => {
      unsub();
    };
  }, [currentId]);

  // useEffect(() => {
  //   console.log("Current Client: ", curClient);
  // }, [curClient]);

  return (
    <ThemeProvider theme={violet_theme}>
      <Typography>Customer Chat Page</Typography>
      <MainContainer
        responsive
        style={{
          height: "600px",
        }}
      >
        <Sidebar position="left">
          <Search placeholder="Search..." />
          <ConversationList>
            {clientList?.map((client, index) => {
              return curClient &&
                curClient.roomStatus?.chatId === client.roomStatus?.chatId ? (
                <Conversation
                  active
                  info={client.messages[client.messages.length - 1]?.message}
                  lastSenderName={
                    client.messages[client.messages?.length - 1]?.sender
                  }
                  name={
                    client.isAuthenticated
                      ? client.roomStatus?.customerDisplayName
                      : client.roomStatus?.chatId
                  }
                  onClick={() => {
                    setCurClient({ ...client });
                  }}
                  key={"conversation-" + index}
                >
                  <Avatar
                    src={client.roomStatus?.customerAvatarUrl}
                    status={
                      client.roomStatus?.isCustomerOnline ? "available" : "dnd"
                    }
                  ></Avatar>
                </Conversation>
              ) : (
                <Conversation
                  info={client.messages[client.messages.length - 1]?.message}
                  lastSenderName={
                    client.messages[client.messages.length - 1]?.sender
                  }
                  name={
                    client.isAuthenticated
                      ? client.roomStatus?.customerDisplayName
                      : client.roomStatus?.chatId
                  }
                  onClick={() => {
                    setCurClient({ ...client });
                  }}
                  key={"conversation-" + index}
                >
                  <Avatar
                    name={client.roomStatus?.customerDisplayName}
                    src={client.roomStatus?.customerAvatarUrl}
                    status={
                      client.roomStatus?.isCustomerOnline ? "available" : "dnd"
                    }
                  />
                </Conversation>
              );
            })}
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name={curClient?.roomStatus?.customerDisplayName}
              src={curClient?.roomStatus?.customerAvatarUrl}
            />
            {curClient && (
              <ConversationHeader.Content
                info={
                  "Active " +
                  toDifferenceDayTimeToNow(curClient?.roomStatus?.lastActive)
                }
                userName={curClient?.roomStatus?.customerDisplayName}
              />
            )}
            <ConversationHeader.Actions>
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={
              isCustomerTyping(curClient) && (
                <TypingIndicator content="Customer is typing" />
              )
            }
          >
            <MessageSeparator
              content={toSimpleDateTimeString(curClient?.createdAt)}
            />
            {curClient?.messages?.map((msg, index) => (
              <Message
                model={{
                  direction: msg.sender !== "Staff" ? "incoming" : "outgoing",
                  message: msg.message,
                  sender: msg.sender,
                  sentTime: "15 mins ago",
                  position: getMessagePosition(curClient.messages, index),
                }}
                key={"message-" + index}
              >
                {msg.sender !== "Staff" && (
                  <Avatar
                    name={msg.sender}
                    src={curClient.roomStatus?.customerAvatarUrl}
                  />
                )}
              </Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={(content) => {
              handleSendMessageToClient(curClient, content);
            }}
            onChange={(val) => {
              if (val.length > 0) {
                handleAddTypingUser("Staff");
              } else {
                handleRemoveTypingUser("Staff");
              }
            }}
          />
        </ChatContainer>
        <Sidebar position="right">
          <ExpansionPanel open title="INFO">
          </ExpansionPanel>

          <ExpansionPanel title="OPTIONS">
          </ExpansionPanel>
        </Sidebar>
      </MainContainer>
    </ThemeProvider>
  );
}

export default function CustomerChatPage() {
  return <Dashboard selectedIndex={9} childComponent={ViewPort} />;
}
