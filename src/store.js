import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import thunk from "redux-thunk";
import userReducer from "./store/slices/userSlice";
import productsReducer from "./store/slices/productsSlice";
import postsReducer from "./store/slices/postsSlice";

const middleware = [thunkMiddleware, thunk];

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    posts : postsReducer,
  },
  middleware,
});

export default store;
