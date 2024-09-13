import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  posts: [],
  error: null,
};

export const POSTS_LOCAL_STORAGE_KEY = "posts";

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPostsSuccess: (state, action) => {
      state.loading = false;
      if (action.payload.length !== 0) {
        state.posts = action.payload;
      }
      state.error = null;
      // save to local storage
      localStorage.setItem(
        POSTS_LOCAL_STORAGE_KEY,
        JSON.stringify(state.posts)
      );
    },
    getPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addPostSuccess: (state, action) => {
      state.loading = false;
      state.posts.push(action.payload);
      state.error = null;
      // update local storage
      localStorage.setItem(
        POSTS_LOCAL_STORAGE_KEY,
        JSON.stringify(state.posts)
      );
    },
    addPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePostSuccess: (state, action) => {
      state.loading = false;
      const updatedPost = action.payload;
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      state.error = null;
      // update local storage
      localStorage.setItem(
        POSTS_LOCAL_STORAGE_KEY,
        JSON.stringify(state.posts)
      );
    },
    updatePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  addPostStart,
  addPostSuccess,
  addPostFailure,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
} = postsSlice.actions;

export default postsSlice.reducer;
