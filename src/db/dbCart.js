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

import { Cart } from "../models/Cart";

export const CART_PATH = "/system/public/carts/";
export const CART_COLLECTION_PATH = "system/public/carts";
export const CART_COLLECTION = collection(db, CART_COLLECTION_PATH);

export const getAllCart = async (onSuccess = null, onFailure = null) => {
  const carts = [];
  getDocs(CART_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        carts.push(e);
      });
      if (onSuccess) {
        onSuccess(carts);
      }
    })
    .catch((error) => {
      console.error("getAllCart error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const updateCart = async (cart, onSuccess = null, onFailure = null) => {
  const docRef = doc(db, CART_PATH, cart.id);
  updateDoc(docRef, cart)
    .then(() => {
      if (onSuccess) {
        onSuccess(cart);
      }
    })
    .catch((error) => {
      console.error("updateCart error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getCartById = async (
  cartId,
  onSuccess = null,
  onFailure = null
) => {
  getDoc(doc(db, CART_PATH, cartId))
    .then((docSnap) => {
      if (docSnap.exists()) {
        const cart = docSnap.data();
        if (onSuccess) {
          onSuccess(cart);
        }
      } else {
        if (onFailure) {
          onFailure("No such document!");
        }
      }
    })
    .catch((error) => {
      console.error("getCartById error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const syncCartModel = async (onSuccess = null, onFailure = null) => {
  await getAllCart(
    (carts) => {
      carts.forEach((cart) => {
        const cartModel = new Cart();
        const mergedData = { ...cartModel.data(), ...cart };
        updateCart(
          mergedData,
          (rCart) => {
            console.log("syncCartModel success");
          },
          (error) => {
            console.error("syncCartModel error", error);
          }
        );
      });
      if (onSuccess) {
        onSuccess(carts);
      }
    },
    (error) => {
      console.error("syncCartModel error", error);
      if (onFailure) {
        onFailure(error);
      }
    }
  );
};

export const increaseItemQuantity = async (
  cart,
  index,
  onSuccess,
  onFailure
) => {
  console.log("increaseItemQuantity", cart, index);
  const newCart = { ...cart };
  newCart.productsQuantity[index] += 1;
  updateCart(newCart, onSuccess, onFailure);
};

/**
 * decrease quantity of an item in the cart
 * @throws error "-1" if quantity is less than or equal to 1
 * @param {*} cart
 * @param {*} index
 * @param {*} onSuccess return the updated cart if successful
 * @param {*} onFailure return the error message
 */
export const decreaseItemQuantity = async (
  cart,
  index,
  onSuccess,
  onFailure
) => {
  console.log("decreaseItemQuantity", cart, index);
  const newCart = { ...cart };

  if (newCart.productsQuantity[index] <= 1) {
    throw new Error("-1");
  }

  newCart.productsQuantity[index] -= 1;
  updateCart(newCart, onSuccess, onFailure);
};

export const removeItem = async (cart, index, onSuccess, onFailure) => {
  console.log("removeItem", cart, index);
  const newCart = { ...cart };
  newCart.products.splice(index, 1);
  newCart.productsQuantity.splice(index, 1);
  newCart.stockIds.splice(index, 1);
  updateCart(newCart, onSuccess, onFailure);
};

export const addItemToCart = async (
  cartId,
  cartData,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addProductToCart", cartId, cartData);

  const { userId, productId, quantity, stockId } = cartData;
  getCartById(
    cartId,
    (cart) => {
      console.log(">>>check cart by id: ", cart);

      const itemIndex = cart.products.findIndex(
        (p, index) => p === productId && cart.stockIds[index] === stockId
      );

      if (itemIndex > -1) {
        // If the product exists, update the quantity
        cart.productsQuantity[itemIndex] += quantity;
      } else {
        // If the product does not exist, add the product and quantity
        cart.products.push(productId);
        cart.productsQuantity.push(quantity);
        cart.stockIds.push(stockId);
        cart.accessories = cart.accessories || [];
        cart.accessoriesQuantity = cart.accessoriesQuantity || [];
      }

      updateCart(
        cart,
        (updatedCart) => {
          if (onSuccess) {
            onSuccess(updatedCart);
          }
        },
        (error) => {
          console.error("updateCart error", error);
          if (onFailure) {
            onFailure(getFirebaseUserErrorMessage(error));
          }
        }
      );
    },
    (error) => {
      console.log(">>>error add item to cart: ", error);
    }
  );
};

export const getCartItemsCount = async (
  cartId,
  onSuccess = null,
  onFailure = null
) => {
  await getCartById(
    cartId,
    (cart) => {
      if (onSuccess) {
        onSuccess(cart.products.length);
      }
    },
    (error) => {
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    }
  );
};

export const removeMultipleItemsFromCart = async (cart, indexes, onSuccess, onFailure) => {
  console.log("removeMultipleItems", cart, indexes);
  const newCart = { ...cart };
  newCart.products = newCart.products.filter((p, index) => !indexes.includes(index));
  newCart.productsQuantity = newCart.productsQuantity.filter((p, index) => !indexes.includes(index));
  newCart.stockIds = newCart.stockIds.filter((p, index) => !indexes.includes(index));
  updateCart(newCart, onSuccess, onFailure);
};
