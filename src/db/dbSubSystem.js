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

export const SUB_SYSTEM_PATH = "/system/subsystem";

export const getSubSystem = async (onSuccess, onFailure) => {
  console.log("getSubSystem");
  try {
    const docRef = doc(db, SUB_SYSTEM_PATH);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      onSuccess(docSnap.data());
    } else {
      if (onFailure) {
        console.error("No such document!");
        onFailure("Somethign went wrong while fetching subsystem data");
      }
    }
  } catch (error) {
    console.error("Error getting document:", error);
    if (onFailure);
    onFailure(getFirebaseUserErrorMessage(error));
  }
};
