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
  limit,
} from "firebase/firestore";

import { Post } from "../models/Post";
import { query } from "firebase/database";
import {
  addPostFailure,
  addPostSuccess,
  getPostsFailure,
  getPostsStart,
  getPostsSuccess,
  updatePostFailure,
  updatePostStart,
  updatePostSuccess,
} from "../store/slices/postsSlice";
import { useDispatch } from "react-redux";
import { reduxAddPost } from "../store/actions/postsAction";

const POST_PATH = "/system/public/posts/";
const POST_COLLECTION_PATH = "system/public/posts";
const POST_COLLECTION = collection(db, POST_COLLECTION_PATH);

export const updatePost = async (post, onSuccess = null, onFailure = null) => {
  console.log("updatePost");
  try {
    await updateDoc(doc(db, POST_PATH, post.id), post);
    post.lastUpdate = Date.now();
    if (onSuccess) {
      onSuccess(post);
    }
  } catch (error) {
    console.error("updatePost error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addNewPost = async (post, onSuccess = null, onFailure = null) => {
  console.log("addNewPost");
  try {
    const docRef = await addDoc(POST_COLLECTION, post);
    // setup post id
    post.id = docRef.id;
    post.lastUpdate = Date.now();
    post.publishedAt = Date.now();
    // update the post with the id
    setDoc(doc(db, POST_PATH, docRef.id), post)
      .then(() => {
        if (onSuccess) {
          onSuccess(post);
        }
      })
      .catch((error) => {
        console.error("addNewPost error", error);
        if (onFailure) {
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
  } catch (error) {
    console.error("addNewPost error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const getAllPost = async (
  maxPosts = 3,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getAllPost");
  const posts = [];
  getDocs(query(POST_COLLECTION, limit(maxPosts)))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        posts.push(e);
      });
      if (onSuccess) {
        console.log("getAllPost", posts);
        onSuccess(posts);
      }
    })
    .catch((error) => {
      console.error("getAllPost error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getAllPostWithoutLimit = async (
  onSuccess = null,
  onFailure = null
) => {
  console.log("getAllPost");
  const posts = [];
  getDocs(query(POST_COLLECTION))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        posts.push(e);
      });
      if (onSuccess) {
        console.log("getAllPost [success]: ", posts);
        onSuccess(posts);
      }
    })
    .catch((error) => {
      console.error("getAllPost error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getPostById = async (
  postId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getPostById");
  getDoc(doc(db, POST_PATH, postId))
    .then((doc) => {
      if (doc.exists()) {
        let e = doc.data();
        e.id = doc.id;
        if (onSuccess) {
          onSuccess(e);
        }
      } else {
        console.error("No such document!");
        if (onFailure) {
          onFailure("No such document!");
        }
      }
    })
    .catch((error) => {
      console.error("getPostById error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getAllPostsByProduct = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getAllPostsByProductId");
  const posts = [];
  for (let i = 0; i < product.posts.length; i++) {
    getDoc(doc(db, POST_PATH, product.posts[i]))
      .then((doc) => {
        if (doc.exists()) {
          let e = doc.data();
          e.id = doc.id;
          posts.push(e);
        }
        if (i === product.posts.length - 1) {
          if (onSuccess) {
            onSuccess(posts);
          }
        }
      })
      .catch((error) => {
        console.error("getAllPostsByProductId error", error);
        if (onFailure) {
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
  }
};

// export const useGetAllPosts = () => {
//   const dispatch = useDispatch();
//   const getAllPosts = async () => {
//     dispatch(getPostsStart());
//     try {
//       getAllPostWithoutLimit(
//         (posts) => {
//           dispatch(getPostsSuccess(posts));
//         },
//         (error) => {
//           dispatch(getPostsSuccess(error));
//         }
//       );
//     } catch (error) {
//       dispatch(getPostsFailure(error));
//     }
//   };

//   return getAllPosts;
// };

export const useAddPost = () => {
  const dispatch = useDispatch();
  const addPost = async (post, onSuccess, onFailure) => {
    addNewPost(
      post,
      (post) => {
        dispatch(addPostSuccess(post));
        if(onSuccess) {
          onSuccess(post);
        }
      },
      (error) => {
        dispatch(addPostFailure(error));
        if(onFailure) {
          onFailure(error);
        }
      }
    );
  };

  return addPost;
};

export const useUpdatePost = () => {
  const dispatch = useDispatch();
  dispatch(updatePostStart());
  const updatePostFirebaseAndRedux = async (post, onSuccess, onFailure) => {
    updatePost(
      post,
      (post) => {
        dispatch(updatePostSuccess(post));
        if(onSuccess) {
          onSuccess(post);
        }
      },
      (error) => {
        dispatch(updatePostFailure(error));
        if(onFailure) {
          onFailure(error);
        }
      }
    );
  };

  return updatePostFirebaseAndRedux;
};
