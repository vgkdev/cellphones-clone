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

import { Stock } from "../models/Stock";
import {
  deleteImage,
  deleteStockImageBucket,
  uploadStockImage,
} from "./storageImage";

const PRODUCT_PATH = "/system/public/products/";
const PRODUCT_COLLECTION_PATH = "system/public/products";
const PRODUCT_COLLECTION = collection(db, PRODUCT_COLLECTION_PATH);

export const getAllProductStocks = async (
  productId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getAllProductStocks");
  if (productId === null || productId === undefined || productId === "") {
    if (onFailure) {
      onFailure("Product ID is empty");
    }
    return;
  }
  const stocks = [];
  getDocs(collection(db, PRODUCT_PATH + productId + "/stocks"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        stocks.push(e);
      });
      if (onSuccess) {
        onSuccess(stocks);
      }
    })
    .catch((error) => {
      console.error("getAllProductStocks error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const addProductStock = async (
  productId,
  stock,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addProductStock");
  const docRef = await addDoc(
    collection(db, PRODUCT_PATH + productId + "/stocks"),
    stock
  );
  if (onSuccess) {
    console.log("Document written with ID: ", docRef.id);
    onSuccess(docRef.id);
  }
};

export const updateProductStock = async (
  productId,
  stock,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateProductStock");
  console.log("productId:", productId);
  console.log("stock", stock);

  stock.lastUpdate = Date.now();
  updateDoc(doc(db, PRODUCT_PATH + productId + "/stocks", stock.id), stock)
    .then(() => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((error) => {
      console.error("updateProductStock error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const saveProductStock = async (
  productId,
  stock,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateProductStock");
  console.log("productId:", productId);
  console.log("stock", stock);

  if (stock.id !== undefined && stock.id !== "") {
    if (stock.imageUrls.length === 0) {
      const errorMessage = `Stock must have at least one image, stock ${stock.color}, product ${productId}`;
      console.error(errorMessage);
      if (onFailure) {
        onFailure(errorMessage);
      }
      return;
    }
  }

  stock.lastUpdate = Date.now();
  updateDoc(doc(db, PRODUCT_PATH + productId + "/stocks", stock.id), stock)
    .then(() => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((error) => {
      console.error("updateProductStock error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const deleteProductStock = async (
  productId,
  stockId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteProductStock");
  deleteDoc(doc(db, PRODUCT_PATH + productId + "/stocks", stockId))
    .then(() => {
      deleteStockImageBucket(
        productId,
        stockId,
        () => {
          if (onSuccess) {
            onSuccess();
          }
        },
        onFailure
      );
    })
    .catch((error) => {
      console.error("deleteProductStock error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const addStockImage = async (
  stock,
  file,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addStockImage");
  console.log("stock:", stock);
  console.log("file:", file);
  uploadStockImage(
    stock.productId,
    stock.id,
    file,
    (url, name) => {
      stock.imageUrls.push(url);
      stock.imageNames.push(name);
      console.log("stock", stock);
      updateProductStock(stock.productId, stock, onSuccess, onFailure);
    },
    onFailure,
    (progress) => {}
  );
};

export const deleteStockImage = async (
  stock,
  imageIndex,
  onSuccess = null,
  onFailure = null
) => {
  try {
    console.log("deleteStockImage");
    deleteImage(
      stock.imageUrls[imageIndex],
      () => {
        stock.imageUrls.splice(imageIndex, 1);
        stock.imageNames.splice(imageIndex, 1);
        updateProductStock(
          stock.productId,
          stock,
          () => {
            stock.imageUrls.splice(imageIndex, 1);
            stock.imageNames.splice(imageIndex, 1);
            if (onSuccess) {
              onSuccess();
            }
          },
          onFailure
        );
      },
      () => {
        if (onFailure) {
          onFailure("Failed to delete image");
        }
      }
    );
  } catch (error) {
    console.error("deleteStockImage error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const getStockById = async (
  productId,
  stockId,
  onSuccess,
  onFailure
) => {
  console.log("getStockById");

  getDoc(doc(db, PRODUCT_PATH + productId + "/stocks", stockId))
    .then((doc) => {
      if (doc.exists()) {
        let e = doc.data();
        e.id = doc.id;
        onSuccess(e);
      } else {
        console.error("No such document!");
        console.error(
          "product with id %s has no stock with id %s",
          productId,
          stockId
        );
        debugger;
        onFailure("No such document!");
      }
    })
    .catch((error) => {
      console.error("getStockById error", error);
      onFailure(getFirebaseUserErrorMessage(error));
    });
};
