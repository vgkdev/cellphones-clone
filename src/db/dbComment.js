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

import { Comment } from "../models/Comment";
import { updateProduct } from "./dbProduct";
import {
  updateProductStart,
  updateProductSuccess,
} from "../store/slices/productsSlice";

export const COMMENT_PATH = "/system/public/comments/";
export const COMMENT_COLLECTION_PATH = "system/public/comments";
export const COMMENT_COLLECTION = collection(db, COMMENT_COLLECTION_PATH);

export const updateComment = async (
  comment,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateComment");
  const docRef = doc(db, COMMENT_PATH, comment.id);
  updateDoc(docRef, comment)
    .then(() => {
      if (onSuccess) {
        onSuccess(comment);
      }
    })
    .catch((error) => {
      console.error("updateComment error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const addProductComment = async (
  product,
  comment,
  onSuccess,
  onFailure,
  dispatch = null
) => {
  if (
    comment.content === "" &&
    comment.attachedImages.length === 0 &&
    comment.attachedGifs.length === 0
  ) {
    if (onFailure) {
      onFailure("Comment cannot be empty");
    }
    return;
  }
  try {
    const newProductData = { ...product };
    await addDoc(COMMENT_COLLECTION, comment).then((docRef) => {
      newProductData.comments.push(docRef.id);
      comment.id = docRef.id;
    });
    await updateComment(comment, null, (e) => {
      throw e;
    });
    if (dispatch) {
      await dispatch(updateProductStart());
    }
    await updateProduct(newProductData, product.id, null, (e) => {
      throw e;
    });
    if (dispatch) {
      await dispatch(updateProductSuccess(newProductData));
    }
    if (onSuccess) {
      onSuccess(comment);
    }
  } catch (error) {
    console.error("addProductComment error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addReplyToComment = async (
  parentComment,
  comment,
  onSuccess = null,
  onFailure = null
) => {
  if (
    comment.content === "" &&
    comment.attachedImages.length === 0 &&
    comment.attachedGifs.length === 0
  ) {
    if (onFailure) {
      onFailure("Reply cannot be empty");
    }
    return;
  }
  try {
    const newParentComment = { ...parentComment };
    await addDoc(COMMENT_COLLECTION, comment)
      .then((docRef) => {
        newParentComment.replies.push(docRef.id);
        comment.id = docRef.id;
      })
      .catch((error) => {
        console.error("addReplyToComment error", error);
        if (onFailure) {
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
    await updateComment(comment, null, onFailure);
    await updateComment(
      newParentComment,
      () => {
        if (onSuccess) {
          onSuccess(comment);
        }
      },
      onFailure
    );
  } catch (error) {
    console.error("addReplyToComment error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const getCommentById = async (
  commentId,
  onSuccess = null,
  onFailure = null
) => {
  const docRef = doc(db, COMMENT_PATH, commentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (onSuccess) {
      onSuccess(docSnap.data());
    }
  } else {
    if (onFailure) {
      onFailure("No such document!");
    }
  }
};

export const getAllProductComments = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getAllProductComments");
  try {
    const comments = [];
    for (const commentId of product.comments) {
      const commentDoc = await getDoc(doc(db, COMMENT_PATH, commentId));
      if (commentDoc.exists()) {
        comments.push(commentDoc.data());
      }
    }
    if (onSuccess) {
      onSuccess(comments);
    }
  } catch (error) {
    console.error("getAllProductComments error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const handleLikeComment = async (
  userId,
  comment,
  onSuccess,
  onFailure
) => {
  console.log("likeComment");
  const newComment = { ...comment };
  if (!newComment.likes.includes(userId)) {
    newComment.likes.push(userId);
    // if dislike, remove from dislikes
    if (newComment.dislikes.includes(userId)) {
      newComment.dislikes = newComment.dislikes.filter((id) => id !== userId);
    }
  } else {
    newComment.likes = newComment.likes.filter((id) => id !== userId);
  }

  await updateComment(newComment, onSuccess, onFailure);
};

export const handleDislikeComment = async (
  userId,
  comment,
  onSuccess,
  onFailure
) => {
  console.log("dislikeComment");
  const newComment = { ...comment };
  if (!newComment.dislikes.includes(userId)) {
    newComment.dislikes.push(userId);
    // if like, remove from likes
    if (newComment.likes.includes(userId)) {
      newComment.likes = newComment.likes.filter((id) => id !== userId);
    }
  } else {
    newComment.dislikes = newComment.dislikes.filter((id) => id !== userId);
  }

  await updateComment(newComment, onSuccess, onFailure);
};
