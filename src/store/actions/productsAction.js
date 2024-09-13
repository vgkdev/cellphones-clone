import {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
} from "../slices/productsSlice";
import {
  getAllProducts as getAllProductsFromFirebase,
  updateProduct as updateProductInFirebase,
} from "../../db/dbProduct";

export const getAllProducts = () => async (dispatch) => {
  dispatch(getProductsStart());
  try {
    await getAllProductsFromFirebase(
      (products) => {
        console.log(products);
        dispatch(getProductsSuccess(products));
      },
      (error) => {
        console.error("Failed to fetch product list", error);
        dispatch(getProductsFailure(error.message));
      }
    );
  } catch (error) {
    console.error("Failed to fetch product list", error);
    dispatch(getProductsFailure(error.message));
  }
};

export const updateProduct = (product, docId) => async (dispatch) => {
  dispatch(updateProductStart());
  try {
    await updateProductInFirebase(
      product,
      docId,
      (updatedProduct) => {
        dispatch(updateProductSuccess(updatedProduct));
      },
      (error) => {
        console.error("Failed to update product", error);
        dispatch(updateProductFailure(error.message));
      }
    );
  } catch (error) {
    console.error("Failed to update product", error);
    dispatch(updateProductFailure(error.message));
  }
};
