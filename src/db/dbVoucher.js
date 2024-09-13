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

import { Voucher } from "../models/Voucher";

export const VOUCHER_PATH = "/system/public/vouchers/";
export const VOUCHER_COLLECTION_PATH = "system/public/vouchers";
export const VOUCHER_COLLECTION = collection(db, VOUCHER_COLLECTION_PATH);

export const updateVoucher = async (
  voucher,
  onSuccess = null,
  onFailure = null
) => {
  console.log("updateVoucher");
  const voucherObj = new Voucher();
  Object.assign(voucherObj, voucher);
  try {
    await updateDoc(doc(db, VOUCHER_PATH, voucher.id), voucherObj.data());
    voucher.lastUpdate = Date.now();
    if (onSuccess) {
      onSuccess(voucher);
    }
  } catch (error) {
    console.error("updateVoucher error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const addNewVoucher = async (
  voucher,
  onSuccess = null,
  onFailure = null
) => {
  console.log("addNewVoucher");
  // check if voucher code is already used
  const querySnapshot = await getDocs(collection(db, VOUCHER_COLLECTION_PATH));
  querySnapshot.forEach((doc) => {
    let e = doc.data();
    e.id = doc.id;
    if (e.code === voucher.code) {
      if (onFailure) {
        onFailure("Voucher code already used");
      }
      return;
    }
  });

  const voucherObj = new Voucher();
  Object.assign(voucherObj, voucher);

  try {
    const docRef = await addDoc(VOUCHER_COLLECTION, voucherObj.data());
    // setup voucher id
    voucher.id = docRef.id;
    voucher.lastUpdate = Date.now();
    // update the voucher with the id
    setDoc(doc(db, VOUCHER_PATH, docRef.id), voucher)
      .then(() => {
        if (onSuccess) {
          onSuccess(voucher);
        }
      })
      .catch((error) => {
        console.error("addNewVoucher error", error);
        if (onFailure) {
          onFailure(getFirebaseUserErrorMessage(error));
        }
      });
  } catch (error) {
    console.error("addNewVoucher error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const getVoucherById = async (
  voucherId,
  onSuccess = null,
  onFailure = null
) => {
  console.log("getVoucherById " + voucherId);
  try {
    const docSnap = await getDoc(doc(db, VOUCHER_PATH, voucherId));
    if (docSnap.exists()) {
      if (onSuccess) {
        onSuccess(docSnap.data());
      }
    } else {
      if (onFailure) {
        onFailure("No such voucher");
      }
    }
  } catch (error) {
    console.error("getVoucherById error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};

export const getAllVouchers = async (onSuccess = null, onFailure = null) => {
  console.log("getAllVouchers");
  const vouchers = [];
  getDocs(collection(db, VOUCHER_COLLECTION_PATH))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let e = doc.data();
        e.id = doc.id;
        vouchers.push(e);
      });
      if (onSuccess) {
        onSuccess(vouchers);
      }
    })
    .catch((error) => {
      console.error("getAllVouchers error", error);
      if (onFailure) {
        onFailure(getFirebaseUserErrorMessage(error));
      }
    });
};

export const applyVoucherCode = async (
  voucherCode,
  onSuccess = null,
  onFailure = null
) => {
  console.log("applyVoucherCode " + voucherCode);
  try {
    const querySnapshot = await getDocs(
      collection(db, VOUCHER_COLLECTION_PATH)
    );
    querySnapshot.forEach((doc) => {
      let e = doc.data();
      e.id = doc.id;
      if (e.code === voucherCode) {
        if (onSuccess) {
          onSuccess(e);
        }
      }
    });
    if (onFailure) {
      onFailure("No such voucher");
    }
  } catch (error) {
    console.error("applyVoucherCode error", error);
    if (onFailure) {
      onFailure(getFirebaseUserErrorMessage(error));
    }
  }
};
