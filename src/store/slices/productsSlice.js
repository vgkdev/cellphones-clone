import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  products: [],
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.error = null;
    },
    getProductsFailure: (state, action) => {
      state.loading = false;
      state.products = [];
      state.error = action.payload;
    },

    //update
    updateProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess: (state, action) => {
      state.loading = false;
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      state.error = null;
    },
    updateProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
} = productsSlice.actions;

export default productsSlice.reducer;
