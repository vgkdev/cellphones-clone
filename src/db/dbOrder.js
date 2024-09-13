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
  or,
  query,
  where,
} from "firebase/firestore";

import { Order } from "../models/Order";
import { ORDER_STATUS } from "../models/Order";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, updateUserToFirebase } from "../store/actions/userAction";

export const ORDER_PATH = "/system/public/orders/";
export const ORDER_COLLECTION_PATH = "system/public/orders";
export const ORDER_COLLECTION = collection(db, ORDER_COLLECTION_PATH);
export const ORDER_KEY_PATH = "system/public/orderKey";
export const ORDER_KEY_COLLECTION = collection(db, ORDER_KEY_PATH);

export const getAllOrders = async (onSuccess = null, onFailure = null) => {
  const orders = [];
  console.log("getAllOrders");
  getDocs(ORDER_COLLECTION)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        orders.push(e);
      });
      if (onSuccess) {
        onSuccess(orders);
      }
    })
    .catch((error) => {
      console.error("getAllOrders error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const getNextOrderKey = async (onSuccess = null, onFailure = null) => {
  console.log("getNextOrderKey");
  try {
    const docRef = await addDoc(ORDER_KEY_COLLECTION, { dummy: "dummy" });
    const orderKey = docRef.id;
    if (onSuccess) {
      onSuccess(orderKey);
    }
  } catch (error) {
    console.error("getNextOrderKey error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const updateOrder = async (
  order,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateOrder");
  try {
    await updateDoc(doc(db, ORDER_PATH, order.id), order);
    order.lastUpdate = Date.now();
    if (onSuccess) {
      onSuccess(order);
    }
  } catch (error) {
    console.error("updateOrder error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addNewOrder = async (
  order,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addNewOrder");
  try {
    const docRef = await addDoc(ORDER_COLLECTION, order);
    // setup order id
    order.id = docRef.id;
    order.lastUpdate = Date.now();
    // update the order with the id
    setDoc(doc(db, ORDER_PATH, docRef.id), order)
      .then(() => {
        if (onSuccess) {
          onSuccess(order);
        }
      })
      .catch((error) => {
        console.error("addNewOrder error", error);
        if (onFailure) {
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
  } catch (error) {
    console.error("addNewOrder error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const useCreateOrder = () => {
  const user = useSelector((state) => state.user?.user || null);
  const dispatch = useDispatch();

  const createOrder = async (order, onSuccess = null, onFailure = null) => {
    addNewOrder(
      order,
      (rOrder) => {
        if (user) {
          const newUserData = { ...user, orders: [...user.orders, rOrder.id] };
          dispatch(
            updateUserToFirebase(
              newUserData,
              () => {
                if (onSuccess) {
                  onSuccess(rOrder);
                }
              },
              onFailure
            )
          );
        } else {
          if (onSuccess) {
            onSuccess(rOrder);
          }
        }
      },
      onFailure
    );
  };
  return createOrder;
};

export const getUserOrders = async (
  userId,
  onSuccess = null,
  onFailure = null
) => {
  const orders = [];
  const q = query(ORDER_COLLECTION, where("userId", "==", userId));
  console.log("getUserOrders");
  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        orders.push(e);
      });
      if (onSuccess) {
        onSuccess(orders);
      }
    })
    .catch((error) => {
      console.error("getUserOrders error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};
