import { get, push, ref, set } from "firebase/database";
import { rtdb } from "../config/firebase";
import { Message } from "../models/Message";

export const LOCAL_STORAGE_TEMPORAY_CHAT_KEY = "temporaryChatId";

const refExists = async (ref) => {
  const snapshot = await get(ref);
  return snapshot.exists();
};

const setUp = async (chatRef, user=null) => {
  await push(ref(rtdb, chatRef._path + "/conversation"), Message.quickStaffMsg("Hello there! We are here to help you!", ""));
  const data = {
    isTyping: [],
    isCustomerOnline: true,
    isStaffOnline: false,
    chatId: chatRef.key,
    lastActive: Date.now(),
    customerDisplayName: user ? user.displayName : "Anonymous",
    customerAvatarUrl: user ? user.avatarImageUrl : "https://firebasestorage.googleapis.com/v0/b/intro-to-se.appspot.com/o/customerService%2Fperson.png?alt=media&token=0af104d1-9dbf-4895-819f-2a053b9fb9f8",
  };
  await set(ref(rtdb, chatRef._path + "/roomStatus"), data);
  await set(ref(rtdb, chatRef._path + "/createdAt"), Date.now());
};

const rtdbGetAuthenticatedChatRef = async (chatId, user) => {
  const chatRef = ref(rtdb, `customerSupport/authenticatedChats/${chatId}`);
  // create createdAt field if it doesn't exist
  const chatExists = await refExists(chatRef);
  if (!chatExists) {
    await setUp(chatRef, user);
  }
  return chatRef;
};

const rtdbGetUnauthenticatedChatRef = async (chatId) => {
  const chatRef = ref(rtdb, `customerSupport/unauthenticatedChats/${chatId}`);
  const chatExists = await refExists(chatRef);
  if (!chatExists) {
    return await rtdbInitiateChat("");
  }
  return chatRef;
};

const createNewChat = async (chatRefPath) => {
  const chatRef = ref(rtdb, chatRefPath);
  const newChatRef = await push(chatRef, { createdAt: Date.now() });
  await setUp(newChatRef);
  return newChatRef;
};

/**
 * Initialize a chat for the user
 * if uid is an empty string {""}, then it is an unauthenticated chat
 * if it's an unauthenticated chat, then the chatId is stored in local storage
 * with key "temporaryChatId" (@var LOCAL_STORAGE_TEMPORAY_CHAT_KEY)
 * @param {*} uid
 * @returns ID of the newly created chat
 */
export const rtdbInitiateChat = async (uid) => {
  try {
    if (typeof uid === "string" && uid === "") {
      const newChatRef = await createNewChat(
        "customerSupport/unauthenticatedChats"
      );
      localStorage.setItem(LOCAL_STORAGE_TEMPORAY_CHAT_KEY, newChatRef.key);
      return newChatRef;
    } else {
      return await createNewChat("customerSupport/authenticatedChats");
    }
  } catch (error) {
    console.error("Failed to initiate chat:", error);
    throw error;
  }
};
/**
 * Get the chat reference for the user
 * If no user is provided, then it is an unauthenticated chat
 * If no chat is found, then a new chat is initiated
 * @param {} user
 * @returns chat reference
 */
export const rtdbGetChatRef = async (user) => {
  if (user) {
    return await rtdbGetAuthenticatedChatRef(user.id, user);
  } else {
    const chatId = localStorage.getItem(LOCAL_STORAGE_TEMPORAY_CHAT_KEY);
    if (chatId) {
      return await rtdbGetUnauthenticatedChatRef(chatId);
    } else {
      return await rtdbInitiateChat("");
    }
  }
};
/**
 * Get the chat data for the user
 * If no user is provided, then it is an unauthenticated chat
 * If no chat is found, then a new chat is initiated
 * @param {} user
 * @returns chat data (json object)
 */
export const rtdbGetChat = async (user) => {
  const chatRef = await rtdbGetChatRef(user);
  try {
    const snapshot = await get(chatRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error reading data:", error);
  }
};

export const rtdbSendMessage = async (converRef, msg) => {
  try {
    await push(converRef, msg);
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

export const rtdbGetCoversationRef = async (user) => {
  const chatRef = await rtdbGetChatRef(user);
  const path = chatRef._path + "/conversation";
  return ref(rtdb, path);
};

export const rtdbGetRoomStateRef = async (user) => {
  const chatRef = await rtdbGetChatRef(user);
  const path = chatRef._path + "/roomStatus";
  return ref(rtdb, path);
};

export const rtdbSetRoomState = async (roomStateRef, data) => {
  try {
    await set(roomStateRef, data);
  } catch (error) {
    console.error("Failed to set room state:", error);
    throw error;
  }
};

export const rtdbGetCustomerSupportRef = () => {
  return ref(rtdb, "customerSupport");
};

export const rtdbTryToGetConverRef = (chatId, isAuthent) =>{
  const path = isAuthent ? `customerSupport/authenticatedChats/${chatId}` : `customerSupport/unauthenticatedChats/${chatId}`;
  return ref(rtdb, path + "/conversation");
}

export const rtdbTryToGetRoomStateRef = (chatId, isAuthent) =>{
  const path = isAuthent ? `customerSupport/authenticatedChats/${chatId}` : `customerSupport/unauthenticatedChats/${chatId}`;
  if(!refExists(ref(rtdb, path + "/roomStatus"))){
    return null;
  }
  return ref(rtdb, path + "/roomStatus");
}
