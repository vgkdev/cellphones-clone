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

import { FAQ } from "../models/FAQ";
import { getProductById } from "./dbProduct";

const FAQ_PATH = "/system/public/FAQs/";
const FAQ_COLLECTION_PATH = "system/public/FAQs";
const FAQ_COLLECTION = collection(db, FAQ_COLLECTION_PATH);

export const updateFAQ = async (faq, onSuccess = null, onFailure = null) => {
  console.log("updateFAQ");
  try {
    await updateDoc(doc(db, FAQ_PATH, faq.id), faq);
    faq.lastUpdate = Date.now();
    if (onSuccess) {
      onSuccess(faq);
    }
  } catch (error) {
    console.error("updateFAQ error", error);
    if (onFailure) {
      
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addNewFAQ = async (faq, onSuccess = null, onFailure = null) => {
  console.log("addNewFAQ");
  try {
    const faqObj = new FAQ();
    faq = { ...faqObj.data(), ...faq };
    const docRef = await addDoc(FAQ_COLLECTION, faq);
    // setup faq id
    faq.id = docRef.id;
    faq.lastUpdate = Date.now();
    // update the faq with the id
    setDoc(doc(db, FAQ_PATH, docRef.id), faq)
      .then(() => {
        if (onSuccess) {
          onSuccess(faq);
        }
      })
      .catch((error) => {
        console.error("addNewFAQ error", error);
        if (onFailure) {
          
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
  } catch (error) {
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const getAllFAQs = async (onSuccess = null, onFailure = null) => {
  const faqs = [];
  console.log("getAllFAQs");
  getDocs(FAQ_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        faqs.push(e);
      });
      if (onSuccess) {
        onSuccess(faqs);
      }
    })
    .catch((error) => {
      console.error("getAllFAQs error", error);
      if (onFailure) {
        
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getProductFAQsByProduct = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getProductFAQsByProduct");
  if (product.FAQs) {
    const promises = product.FAQs.map((faqId) =>
      getDoc(doc(db, FAQ_PATH, faqId))
        .then((doc) => {
          if (doc.exists()) {
            let e = doc.data();
            e.id = doc.id;
            return e;
          }
        })
        .catch((error) => {
          console.error("getProductFAQsByProduct error", error);
          if (onFailure) {
            
            onFailure(getFirebaseUserErrorMessage(error));
          }
        })
    );

    Promise.all(promises).then((faqs) => {
      if (onSuccess) {
        console.log(faqs);
        onSuccess(faqs);
      }
    });
  }
};

export const getFAQsByProductId = async (
  productId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getFAQsByProductId");
  getProductById(
    productId,
    (product) => {
      getProductFAQsByProduct(product, onSuccess, onFailure);
    },
    onFailure
  );
};
