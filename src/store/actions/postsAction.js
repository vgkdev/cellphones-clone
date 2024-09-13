import {
  getPostsFailure,
  getPostsStart,
  getPostsSuccess,
} from "../slices/postsSlice";

import { getAllPostWithoutLimit as getAllPostsFromFirebase } from "../../db/dbPost";
import { POSTS_LOCAL_STORAGE_KEY } from "../slices/postsSlice";

export const reduxGetAllPosts = () => async (dispatch) => {
  dispatch(getPostsStart());
  try {
    // check local storage first
    if (localStorage.getItem(POSTS_LOCAL_STORAGE_KEY) !== null) {
      const posts = JSON.parse(localStorage.getItem(POSTS_LOCAL_STORAGE_KEY));
      if (posts.length !== 0) {
        await dispatch(getPostsSuccess(posts));
      }
    }
    
    getAllPostsFromFirebase(
      (posts) => {
        dispatch(getPostsSuccess(posts));
      },
      (error) => {
        dispatch(getPostsFailure(error.message));
      }
    );
  } catch (error) {
    dispatch(getPostsFailure(error.message));
  }
};
