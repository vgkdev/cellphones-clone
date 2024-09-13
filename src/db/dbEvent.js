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

import { Event } from "../models/Event";

export const EVENT_PATH = "/system/public/events/";
export const EVENT_COLLECTION_PATH = "system/public/events";
export const EVENT_COLLECTION = collection(db, EVENT_COLLECTION_PATH);

export const updateEvent = async (eventData, onSuccess, onError) => {
  const event = new Event();
  Object.assign(event, eventData);
  console.log("updateEvent", event.data());
  try {
    await setDoc(doc(db, EVENT_COLLECTION_PATH, event.id), event.data());
    if (onSuccess) {
      onSuccess(event.data());
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    if (onError) {
      onError(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addEvent = async (eventData, onSuccess, onError) => {
  const event = new Event();
  Object.assign(event, eventData);
  console.log("addEvent", event.data());
  try {
    const docRef = await addDoc(EVENT_COLLECTION, event.data());
    event.id = docRef.id;
    await setDoc(doc(db, EVENT_COLLECTION_PATH, event.id), event.data());
    if (onSuccess) {
      onSuccess(event.data());
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    if (onError) {
      onError(getFirebaseUserErrorMessage(error));
    }
  }
};

export const getEventById = async (eventId, onSuccess, onError) => {
  try {
    const docRef = doc(db, EVENT_COLLECTION_PATH, eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (onSuccess) {
        onSuccess(docSnap.data());
      }
    } else {
      if (onError) {
        onError("No such document!");
      }
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    if (onError) {
      onError(getFirebaseUserErrorMessage(error));
    }
  }
};
