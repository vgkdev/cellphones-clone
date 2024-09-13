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

import { PRODUCT_TYPES, Product } from "../models/Product";
import { Stock } from "../models/Stock";
import {
  deleteImageByUrl,
  deleteProductImageOnStorage,
  uploadProductDisplayImage,
  uploadProductImage,
} from "./storageImage";
import { refFromURL } from "firebase/database";
import { useSelector } from "react-redux";

export const PRODUCT_PATH = "/system/public/products/";
export const PRODUCT_COLLECTION_PATH = "system/public/products";
export const PRODUCT_COLLECTION = collection(db, PRODUCT_COLLECTION_PATH);

export const getAllProducts = async (onSuccess = null, onFailure = null) => {
  const products = [];
  console.log("getAllProducts");
  getDocs(PRODUCT_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        products.push(e);
      });
      if (onSuccess) {
        onSuccess(products);
      }
    })
    .catch((error) => {
      console.error("getAllProducts error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getProductById = async (
  docId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getProductById");
  getDoc(doc(db, PRODUCT_PATH, docId))
    .then((docSnap) => {
      if (docSnap.exists()) {
        if (onSuccess) {
          onSuccess({ ...docSnap.data(), id: docSnap.id });
        }
      } else {
        console.error("Product not found");
        if (onFailure) {
          onFailure("Product not found");
        }
      }
    })
    .catch((error) => {
      console.error("getProductById error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const addStock = async (
  product,
  stock,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addStock");
  const STOCK_PATH = PRODUCT_PATH + product.id + "/stocks/";
  const STOCK_COLLECTION = collection(db, STOCK_PATH);
  addDoc(STOCK_COLLECTION, stock)
    .then((docRef) => {
      if (onSuccess) {
        onSuccess(product.id);
      }
    })
    .catch((error) => {
      console.error("addStock error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const setUpProduct = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  if (product.id === undefined || product.id === null || product.id === "") {
    console.log("Product id is not set");
    if (onFailure) {
      onFailure("Product id is not set");
    }
    return;
  }

  if (product.isConfigured) {
    if (onSuccess) {
      onSuccess(product);
    }
    return;
  }
  // create a stock collection for the product
  const STOCK_PATH = PRODUCT_PATH + product.id + "/stocks/";
  const STOCK_COLLECTION = collection(db, STOCK_PATH);
  const stock = new Stock(product.id);
  console.log("setUpProduct");
  addDoc(STOCK_COLLECTION, stock.data())
    .then(() => {
      // update product changes
      product.isConfigured = true;
      updateProduct(product, product.id, onSuccess, onFailure);
    })
    .catch((error) => {
      console.error("setUpProduct error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const createProduct = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  if (product.productType !== PRODUCT_TYPES.PHONE) {
    console.error("Invalid product type");
    if (onFailure) console.error("This function is only for phone products");
    onFailure(
      "Invalid product type. Re-input or reload the page and try again."
    );
    return;
  }
  //check for integrities
  if (product.variantName.length !== product.variantCount) {
    console.error("Variant name and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant name and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  if (product.variantMemory.length !== product.variantCount) {
    console.error("Variant memory and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant memory and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  if (product.variantMemoryDataUnit.length !== product.variantCount) {
    console.error("Variant memory data unit and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant memory data unit and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  if (product.variantStorage.length !== product.variantCount) {
    console.error("Variant storage and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant storage and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  if (product.variantStorageDataUnit.length !== product.variantCount) {
    console.error("Variant storage data unit and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant storage data unit and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  if (product.variantPrice.length !== product.variantCount) {
    console.error("Variant price and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant price and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  product.finalPrices = product.variantPrice;

  console.log("createProduct");
  addDoc(PRODUCT_COLLECTION, product)
    .then((docRef) => {
      console.log("New product created with id: ", docRef.id);
      product.id = docRef.id;
      updateProduct(
        product,
        product.id,
        (product) => {
          setUpProduct(product, onSuccess, onFailure);
        },
        onFailure
      );
    })
    .catch((error) => {
      console.error("createProduct error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const createAccessory = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  if (product.productType !== PRODUCT_TYPES.ACCESSORY) {
    console.error("Invalid product type");
    if (onFailure)
      console.error("This function is only for ACCESSORY products");
    onFailure(
      "Invalid product type. Re-input or reload the page and try again."
    );
    return;
  }
  //check for integrities
  if (product.variantName.length !== product.variantCount) {
    console.error("Variant name and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant name and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  if (product.variantPrice.length !== product.variantCount) {
    console.error("Variant price and variant count do not match");
    if (onFailure)
      onFailure(
        "Variant price and variant count do not match. Re-input or reload the page and try again."
      );
    return;
  }

  product.finalPrices = product.variantPrice;

  console.log("createProduct");
  addDoc(PRODUCT_COLLECTION, product)
    .then((docRef) => {
      console.log("New product created with id: ", docRef.id);
      product.id = docRef.id;
      updateProduct(
        product,
        product.id,
        (product) => {
          setUpProduct(product, onSuccess, onFailure);
        },
        onFailure
      );
    })
    .catch((error) => {
      console.error("createProduct error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const updateProduct = async (
  product,
  docId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateProduct");
  product.lastUpdate = Date.now();
  updateDoc(doc(db, PRODUCT_PATH, docId), product)
    .then(() => {
      if (onSuccess) {
        onSuccess(product);
      }
    })
    .catch((error) => {
      console.error("updateProduct error", error);
      if (onFailure) {
        onFailure(error);
      }
    });
};

export const addProductImage = async (
  product,
  file,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addProductImage");
  if (file === null) {
    if (onFailure) onFailure("No file");
    return;
  }

  if (product.imageNames.indexOf(file.name) !== -1) {
    if (onFailure) onFailure("The same name image already exists");
    return;
  }

  uploadProductImage(
    product.id,
    file,
    (url) => {
      product.imageUrls.push(url);
      product.imageNames.push(file.name);
      updateProduct(product, product.id, onSuccess, onFailure);
    },
    onFailure
  );
};

export const setProductImage = async (
  product,
  file,
  onSuccess = null,
  onFailure = null
) => {
  console.log("setProductImage");
  if (product.displayImageUrl !== "") {
    deleteProductDisplayImageUrl(product, null, onFailure);
  }
  uploadProductDisplayImage(
    product.id,
    file,
    (url) => {
      product.displayImageUrl = url;
      updateProduct(product, product.id, onSuccess, onFailure);
    },
    onFailure
  );
};

export const deleteProductImage = async (
  product,
  index,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteProductImage");
  if (index < 0 || index >= product.imageUrls.length) {
    if (onFailure) onFailure("Invalid index");
    return;
  }

  deleteProductImageOnStorage(
    product.id,
    product.imageNames[index],
    () => {
      product.imageUrls.splice(index, 1);
      product.imageNames.splice(index, 1);
      updateProduct(product, product.id, onSuccess, onFailure);
    },
    onFailure
  );
};

export const deleteProductDisplayImageUrl = async (
  product,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteProductDisplayImageUrl");
  deleteImageByUrl(
    product.displayImageUrl,
    () => {
      product.displayImageUrl = "";
      updateProduct(product, product.id, onSuccess, onFailure);
    },
    onFailure
  );
};

export const addProductVideo = async (
  product,
  videoId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addProductVideo");
  product.videos.push(videoId);
  updateProduct(product, product.id, onSuccess, onFailure);
};

export const deleteProductVideo = async (
  product,
  videoId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("deleteProductVideo");
  const index = product.videos.indexOf(videoId);
  if (index === -1) {
    if (onFailure) onFailure("Video not found");
    return;
  }

  product.videos.splice(index, 1);
  updateProduct(product, product.id, onSuccess, onFailure);
};

// will return the product list, throw an error if failed
// prefix: "r" for return function
export const rGetAllProducts = async () => {
  return new Promise((resolve, reject) => {
    getAllProducts(
      (products) => {
        resolve(products);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// #Note: this function is dangerous, need to be implemented and used carefully
// Or we will lose all the product data :))
export const syncProductStructure = async (
  onSuccess = null,
  onFailure = null
) => {
  // update product structure from the latest model
  // first check if the current user has the permission to update the product structure
  // #Todo: implement the permission check
  const products = await rGetAllProducts();
  // merge the product structure with the latest model and update it
  let hasError = false;
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const newProduct = new Product();
    const mergedData = { ...newProduct.data(), ...product };
    console.log(">> syncProductStructure: ", mergedData);
    try {
      await updateDoc(doc(db, PRODUCT_PATH, product.id), mergedData);
    } catch (error) {
      hasError = true;
      break;
    }
  }

  if (hasError) {
    if (onFailure) {
      console.error("Failed to update product structure");
      onFailure("Failed to update product structure");
    }
  } else {
    if (onSuccess) {
      onSuccess();
    }
  }
};

export const addRatingIdToProduct = async (
  product,
  newRatingId,
  onSuccess = null,
  onFailure = null
) => {
  if (product.ratings.includes(newRatingId)) {
    console.error("Rating already exists");
    if (onFailure) onFailure("Rating already exists");
    return;
  }

  const newData = {
    ...product,
    ratings: [...product.ratings, newRatingId],
  };

  updateProduct(newData, product.id, onSuccess, onFailure);
};

export const addReviewIdToProduct = async (
  product,
  newReviewId,
  onSuccess = null,
  onFailure = null
) => {
  if (product.reviews.includes(newReviewId)) {
    console.error("Review already exists");
    if (onFailure) onFailure("Review already exists");
    return;
  }

  updateProduct(
    {
      ...product,
      reviews: [...product.reviews, newReviewId],
    },
    product.id,
    onSuccess,
    onFailure
  );
};
