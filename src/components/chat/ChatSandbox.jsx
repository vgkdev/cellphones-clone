import * as React from "react";
import { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { getSubSystem } from "../../db/dbSubSystem";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";

// stolen from: https://rollbar.com/blog/how-to-integrate-chatgpt-with-react/
const ChatSandbox = ({ messages, setMessages }) => {
  const { showSnackbar } = useSnackbarUtils();
  const [isTyping, setIsTyping] = useState(false);
  const [API_KEY, setAPI_KEY] = useState("");

  const handleSendRequest = async (message) => {
    if (message.length > 80) {
      showSnackbar(
        "You have reached the maximum number of characters",
        "error",
        true
      );
    }

    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      try {
        sendRequestWithExponentialBackoff(() =>
          processMessageToChatGPT([...messages, newMessage])
        );
      } catch (error) {
        showSnackbar("Error processing message" + error, "error", true);
        console.error("Error processing message:", error);
      }
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    if (chatMessages.length > 80) {
      showSnackbar(
        "You have reached the maximum number of messages",
        "error",
        true
      );
    }

    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "This is a selling phone website." +
          " I am a customer, you may help me with any question when buying phone on BuyPhoneOne.vn." +
          "Currently BuyPhoneOne has many events (Summer event, Iphone event, Vouchers, v.v) to attach customer buying." +
          " Your job is to convince them spend the money!" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  async function sendRequestWithExponentialBackoff(
    requestFunc,
    maxRetries = 5
  ) {
    let retryCount = 0;
    let waitingTime = 1000; // Start with 1 second wait time

    while (retryCount < maxRetries) {
      try {
        return await requestFunc(); // Attempt the request
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Wait for the specified time before retrying
          await new Promise((resolve) => setTimeout(resolve, waitingTime));
          waitingTime *= 2; // Double the wait time for the next retry
          retryCount++;
        } else {
          // If the error is not a 429, rethrow it
          throw error;
        }
      }
    }

    throw new Error("Request failed after maximum number of retries.");
  }

  useEffect(() => {
    getSubSystem(
      (data) => {
        setAPI_KEY(data.chatGPTAPIKey);
      },
      (error) => {
        showSnackbar("Failed to fetch subsystem data: " + error, "error", true);
      }
    );
  }, []);

  if (API_KEY === "") {
    return <SimpleLoadingDisplay />;
  }

  return (
    <div style={{ height: "500px", width: "400px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null
            }
          >
            {messages.map((message, i) => {
              // Check if the sender is "user" to align right, otherwise align left for ChatGPT messages
              const isOwnMessage = message.sender === "user";
              return (
                <Message
                  key={i}
                  model={{
                    ...message,
                    direction: isOwnMessage ? "outgoing" : "incoming",
                  }}
                />
              );
            })}
          </MessageList>
          <MessageInput
            placeholder="Send a Message"
            onSend={handleSendRequest}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatSandbox;
