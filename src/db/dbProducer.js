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

import { Producer } from "../models/Producer";

export const PRODUCER_PATH = "/system/public/producers/";
export const PRODUCER_COLLECTION_PATH = "system/public/producers";
export const PRODUCER_COLLECTION = collection(db, PRODUCER_COLLECTION_PATH);

export const getAllProducers = async (onSuccess = null, onFailure = null) => {
  const producers = [];
  console.log("getAllProducers");
  getDocs(PRODUCER_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        producers.push(e);
      });
      if (onSuccess) {
        onSuccess(producers);
      }
    })
    .catch((error) => {
      console.error("getAllProducers error", error);
      if (onFailure) {
        
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getProducerById = async (
  docId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getProducerById");
  getDoc(doc(db, PRODUCER_PATH, docId))
    .then((docSnap) => {
      if (docSnap.exists()) {
        if (onSuccess) {
          onSuccess({ ...docSnap.data(), id: docSnap.id });
        }
      } else {
        console.error("Producer not found");
        if (onFailure) {
          
          onFailure("Producer not found");
        }
      }
    })
    .catch((error) => {
      console.error("getProducerById error", error);
      if (onFailure) {
        
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const addProducer = async (
  producer,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addProducer");
  addDoc(PRODUCER_COLLECTION, producer)
    .then((docRef) => {
      if (onSuccess) {
        onSuccess(docRef.id);
      }
    })
    .catch((error) => {
      console.error("addProducer error", error);
      if (onFailure) {
        
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const updateProducer = async (
  producer,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateProducer");
  setDoc(doc(db, PRODUCER_PATH, producer.id), producer)
    .then(() => {
      if (onSuccess) {
        onSuccess(producer.id);
      }
    })
    .catch((error) => {
      console.error("updateProducer error", error);
      if (onFailure) {
        
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

// export const deleteProducer = async (
//   producer,
//   onSuccess = null,
//   onFailure = null
// ) => {
//   console.log("deleteProducer");
//   deleteDoc(doc(db, PRODUCER_PATH, producer.id))
//     .then(() => {
//       if (onSuccess) {
//         onSuccess(producer.id);
//       }
//     })
//     .catch((error) => {
//       if (onFailure) {
//         onFailure(getFirebaseUserErrorMessage(error));
//       }
//     });
// };