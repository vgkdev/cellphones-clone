import { db, storage } from "../config/firebase";

import { getFirebaseUserErrorMessage } from "../utils/db";

import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const USER_PATH = "/users/";

export const NOTIFICATION_COLLECTION_SUB_PATH = "notifications";

export const updateNotification = async (userId, noti, onSuccess=null, onFailure=null) => {
  console.log("Updating notification:", noti);
  try {
    await updateDoc(doc(db, USER_PATH + userId + "/" + NOTIFICATION_COLLECTION_SUB_PATH, noti.id), noti);
    console.log("Notification updated with ID: ", noti.id);
    if(onSuccess) onSuccess(
      noti.id
    );
  } catch (e) {
    console.error("Error updating notification:", e);
    if(onFailure) {
      console.error("Error updating notification:", e);
      onFailure(getFirebaseUserErrorMessage(e));
    }
  }
}

export const addNotification = async (userId, noti, onSuccess, onFailure=null) => {
  console.log("Adding notification:", noti);

  if(userId === null || userId === undefined || userId === ""){
    console.error("User ID is empty");
    if(onFailure) onFailure("User ID is empty");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, USER_PATH + userId + "/" + NOTIFICATION_COLLECTION_SUB_PATH), noti);
    noti.id = docRef.id;
    await updateDoc(doc(db, USER_PATH + userId + "/" + NOTIFICATION_COLLECTION_SUB_PATH, docRef.id), noti);
    console.log("Notification added with ID: ", docRef.id);
    onSuccess(docRef.id);
  } catch (e) {
    console.error("Error adding notification:", e);
    onFailure(getFirebaseUserErrorMessage(e));
  }
}

export const getUserNotiCollection = (userId) => {
  const notiCollection = collection(db, USER_PATH + userId + "/" + NOTIFICATION_COLLECTION_SUB_PATH);
  return notiCollection;
}

export const markNotificationAsRead = async (userId, notiId, onSuccess=null, onFailure=null) => {
  console.log("Marking notification as read:", notiId);
  try {
    await updateDoc(doc(db, USER_PATH + userId + "/" + NOTIFICATION_COLLECTION_SUB_PATH, notiId), {
      status: 1,
    });
    console.log("Notification marked as read with ID: ", notiId);
    if(onSuccess) onSuccess(
      notiId
    );
  } catch (e) {
    console.error("Error marking notification as read:", e);
    if(onFailure) onFailure(getFirebaseUserErrorMessage(e));
  }
}

export const markAllNotificationsAsRead = async (userId, onSuccess=null, onFailure=null) => {
  console.log("Marking all notifications as read for user:", userId);
  try {
    const notiCollection = getUserNotiCollection(userId);
    const querySnapshot = await getDocs(notiCollection);
    querySnapshot.forEach(async (docSnapshot) => {
      const docRef = doc(db, USER_PATH + userId + "/" + NOTIFICATION_COLLECTION_SUB_PATH, docSnapshot.id);
      await updateDoc(docRef, {
        status: 1,
      });
    });
    console.log("All notifications marked as read for user:", userId);
    if(onSuccess) onSuccess();
  } catch (e) {
    console.error("Error marking all notifications as read:", e);
    if(onFailure) onFailure(getFirebaseUserErrorMessage(e));
  }
}