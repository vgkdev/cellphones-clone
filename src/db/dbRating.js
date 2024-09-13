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

import { Rating } from "../models/Rating";
import { useEffect, useState } from "react";
import { addRatingIdToProduct } from "./dbProduct";

const RATING_PATH = "/system/public/ratings/";
const RATING_COLLECTION_PATH = "system/public/ratings";
export const RATING_COLLECTION = collection(db, RATING_COLLECTION_PATH);

export const getAllRatings = async (onSuccess = null, onFailure = null) => {
  const ratings = [];
  console.log("getAllRatings");
  getDocs(RATING_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        ratings.push(e);
      });
      if (onSuccess) {
        onSuccess(ratings);
      }
    })
    .catch((error) => {
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const asyncGetAllRating = async () => {
  const ratings = [];
  console.log("getAllRatings");
  const querySnapshot = await getDocs(RATING_COLLECTION);
  querySnapshot.forEach((doc) => {
    let e = doc.data();
    e.id = doc.id;
    ratings.push(e);
  });
  return ratings;
};

function useRatings() {
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    getAllRatings((ratings) => {
      setRatings(ratings);
    });
  }, []);

  return ratings;
}

export async function asyncGetAverageRating(productId) {
  let ratings = await asyncGetAllRating();
  let sum = 0;
  let count = 0;
  ratings.forEach((rating) => {
    if (rating.productId === productId) {
      sum += rating.score;
      count++;
    }
  });
  console.log("asyncGetAverageRating >>> check ratings", ratings);
  console.log("asyncGetAverageRating %f - %f", sum, count);
  return count === 0 ? 0 : sum / count;
}

export const addRating = async (
  rating,
  product,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addRating");
  addDoc(RATING_COLLECTION, rating)
    .then(async (docRef) => {
      if (onSuccess) {
        rating.id = docRef.id;
        try {
          await addRatingIdToProduct(
            product,
            rating.id,
            null,
            (product) => {
              console.log("addRatingIdToProduct success", product);
            },
            (error) => {
              console.error("addRatingIdToProduct error", error);
            }
          );
          updateRating(rating, onSuccess, onFailure);
        } catch (error) {
          console.error("addRatingIdToProduct error", error);
          if (onFailure) onFailure(getFirebaseUserErrorMessage(error));
        }
      }
    })
    .catch((error) => {
      if (onFailure) {
        console.log("addRating error", error);
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const updateRating = async (
  rating,
  onSuccess = null,
  onFailure = null
) => {
  // debugger;
  console.log("updateRating");
  updateDoc(doc(db, RATING_PATH, rating.id), rating)
    .then(() => {
      if (onSuccess) {
        onSuccess(rating);
      }
    })
    .catch((error) => {
      console.error("updateRating error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getAllProductRatings = async (
  productId,
  onSuccess = null,
  onFailure = null
) => {
  const ratings = [];
  console.log("getAllProductRatings");
  getDocs(RATING_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        if (e.productId === productId) {
          ratings.push(e);
        }
      });
      if (onSuccess) {
        onSuccess(ratings);
      }
    })
    .catch((error) => {
      console.error("getAllProductRatings error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};
