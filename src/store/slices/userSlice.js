import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem("UserToken")) || null,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUserTrigger: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem("UserToken");
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload;
      }
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload;
      }
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem("UserToken", JSON.stringify(action.payload));
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getNewUserDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getNewUserDataSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload;
        localStorage.setItem("UserToken", JSON.stringify(action.payload));
      }
      state.error = null;
    },
    getNewUserDataFailure: (state, action) => {
      state.loading = false;
      // state.user = null;
      state.error = action.payload;
    },
    addVoucherToUser: (state, action) => {
      const voucherId = action.payload;
      state.user.collectedVouchers.push(voucherId);
    },
  },
});

export const {
  logoutUserTrigger,
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  getNewUserDataStart,
  getNewUserDataSuccess,
  getNewUserDataFailure,
  addVoucherToUser,
} = userSlice.actions;

export default userSlice.reducer;
