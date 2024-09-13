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

import { Review } from "../models/Review";
import { uploadReviewAttachedImage } from "./storageImage";
import { updateUser } from "./dbUser";
import { addReviewIdToProduct } from "./dbProduct";

const REVIEW_PATH = "/system/public/reviews/";
const REVIEW_COLLECTION_PATH = "system/public/reviews";
export const REVIEW_COLLECTION = collection(db, REVIEW_COLLECTION_PATH);

export const getAllReviews = async (onSuccess = null, onFailure = null) => {
  const reviews = [];
  console.log("getAllReviews");
  getDocs(REVIEW_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        reviews.push(e);
      });
      if (onSuccess) {
        onSuccess(reviews);
      }
    })
    .catch((error) => {
      console.error("getAllReviews error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getReviewByProductId = async (
  productId,
  onSuccess = null,
  onFailure = null
) => {
  const reviews = [];
  console.log("getReviewByProductId");
  const querySnapshot = await getDocs(REVIEW_COLLECTION);
  querySnapshot.forEach((doc) => {
    let e = doc.data();
    e.id = doc.id;
    if (e.productId === productId) {
      reviews.push(e);
    }
  });
  if (onSuccess) {
    onSuccess(reviews);
  }
};

export const updateReview = async (
  review,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateReview");
  try {
    await updateDoc(doc(REVIEW_COLLECTION, review.id), review);
    if (onSuccess) {
      onSuccess(review);
    }
  } catch (error) {
    console.error("updateReview error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addReview = async (
  user,
  review,
  product,
  attachedImageFiles,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addReview");
  const uploadPromises = Array.from(attachedImageFiles).map(
    (file) =>
      new Promise((resolve, reject) => {
        uploadReviewAttachedImage(
          user.id,
          review.productId,
          file,
          (url) => resolve(url),
          (error) => reject(error)
        );
      })
  );

  try {
    const uploadedImageUrls = await Promise.all(uploadPromises);
    review.attachedImageUrls = uploadedImageUrls;

    const docRef = await addDoc(REVIEW_COLLECTION, review)
      .then((docRef) => {
        if (onSuccess) {
          review.id = docRef.id;
          console.log("addReview", review);
          updateReview(
            review,
            () => {
              const newUserData = { ...user };
              newUserData.reviews = [...user.reviews, review.id];
              newUserData.reviewedProducts = [
                ...user.reviewedProducts,
                review.productId,
              ];
              updateUser(
                newUserData,
                () => {
                  addReviewIdToProduct(product, review.id, null, (error) => {
                    console.error("addReviewIdToProduct error", error);
                  });
                  onSuccess(review);
                },
                (error) => {
                  console.error("addReview error", error);
                  if (onFailure) {
                    onFailure(error);
                  }
                }
              );
            },
            onFailure
          );
        }
      })
      .catch((error) => {
        if (onFailure) {
          console.log("addReview error", error);
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
  } catch (error) {
    console.error("uploadReviewAttachedImage error", error);
    if (onFailure) {
      onFailure(error);
    }
    return;
  }
};

export const deleteReview = async (
  review,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteReview");
  try {
    await deleteDoc(doc(REVIEW_COLLECTION, review.id));
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("deleteReview error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};
