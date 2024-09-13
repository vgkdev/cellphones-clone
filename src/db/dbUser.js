import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../models/User";
import { Cart } from "../models/Cart";
import { CART_COLLECTION_PATH } from "./dbCart";
import { addRating, updateRating } from "./dbRating";
import { getAllDefaultUserAvatars } from "./storageImage";
import { get } from "firebase/database";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/userAction";
import { useNavigate } from "react-router-dom";
import { updateUser as reduxUpdateUser } from "../store/actions/userAction";

const getAllUsersFromFirebase = async () => {
  console.log("getAllUsersFromFirebase");
  try {
    const querySnapshot = await getDocs(collection(db, "users"));

    return querySnapshot;
  } catch (error) {
    throw error;
  }
};

const addUserToFirebase = async ({ firstName, lastName, email, password }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userModel = new User();
    userModel.firstName = firstName;
    userModel.lastName = lastName;
    userModel.email = email;
    userModel.id = user.uid;
    userModel.dateCreate = Date.now();

    await setDoc(doc(db, "users", user.uid), userModel.data());

    await setUpUserCart(user.uid);

    return true;
  } catch (error) {
    console.error("Error adding user:", error);
    return false;
  }
};

const setUpUserCart = async (userId) => {
  try {
    const newCart = new Cart();
    newCart.id = userId;
    newCart.userId = userId;
    await setDoc(doc(db, CART_COLLECTION_PATH, userId), newCart.data());

    return true;
  } catch (error) {
    console.error("Error setting up user cart:", error);
    return false;
  }
};

const updateUserInFirebase = async ({ userId, firstName, lastName }) => {
  try {
    console.log(firstName, lastName, userId);
    await updateDoc(doc(db, "users", userId), {
      firstName: firstName,
      lastName: lastName,
    });

    return true;
  } catch (error) {
    console.log("Error updating user:", error);
    return false;
  }
};

const deleteUserInFirebase = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));

    return true;
  } catch (error) {
    console.log("Error detete user:", error);
    return false;
  }
};

export const syncUserStructure = async (onSuccess = null, onFailure = null) => {
  const userDocs = await getAllUsersFromFirebase();
  const users = userDocs.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  console.log("syncUserStructure >>> check users: ", users);
  let hasError = false;

  let defaultAvatarList = [];

  await getAllDefaultUserAvatars(
    (avatars) => {
      defaultAvatarList = avatars;
    },
    (error) => {
      if (onFailure) onFailure("Failed to get default avatar list");
      console.error("Failed to get default avatar list");
    }
  );

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const newUser = new User();
    const mergedData = { ...newUser.data(), ...user };

    if (
      mergedData.cartId === undefined ||
      mergedData.cartId === null ||
      mergedData.cartId === ""
    ) {
      mergedData.cartId = user.id;
      await setUpUserCart(user.id);
    }

    if (
      user.avatarImageUrl === undefined ||
      user.avatarImageUrl === null ||
      user.avatarImageUrl === ""
    ) {
      // randomly assign an avatar image to user
      const randomIndex = Math.floor(Math.random() * defaultAvatarList.length);
      mergedData.avatarImageUrl = defaultAvatarList[randomIndex];
      console.log(
        "syncUserStructure >>> check avatar: ",
        mergedData.avatarImageUrl
      );
    }
    // debugger;
    console.log(">> syncUserStructure: ", mergedData);
    try {
      await updateDoc(doc(db, "users", user.id), mergedData);
    } catch (error) {
      hasError = true;
      break;
    }
  }

  if (hasError) {
    console.error("Failed to update user structure");
    if (onFailure) {
      onFailure("Failed to update user structure");
    }
  } else {
    if (onSuccess) {
      onSuccess();
    }
  }
};

export const getUserById = async (
  userId,
  onSuccess = null,
  onFailure = null
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (onSuccess) {
      onSuccess(userSnap.data());
    }
  } catch (error) {
    console.error("getUserById error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const updateUser = async (user, onSuccess = null, onFailure = null) => {
  try {
    await updateDoc(doc(db, "users", user.id), user);
    if (onSuccess) {
      onSuccess(user);
    }
  } catch (error) {
    console.error("updateUser error", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export const addProductRatingIfNotRated = async (
  user,
  product,
  rating,
  onSuccess = null,
  onFailure = null
) => {
  if (user.isCustomer && user.ratedProducts.includes(product.id)) {
    onFailure("You have already rated this product");
    if (onFailure) {
      return;
    }
  }

  addRating(
    rating,
    product,
    (rating) => {
      // debugger;
      try {
        updateUser(
          {
            ...user,
            ratings: [...user.ratings, rating.id],
            ratedProducts: [...user.ratedProducts, product.id],
          },
          (returnUser) => {
            if (onSuccess) {
              onSuccess(rating, returnUser);
            }
          },
          (error) => {
            console.error("addRating error", error);
            if (onFailure) {
              onFailure(error);
            }
          }
        );
      } catch (error) {
        console.error("addRating error", error);
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    (error) => {
      console.error("addRating error", error);
      if (onFailure) {
        onFailure(error);
      }
    }
  );
};

export const useLogout = (fromDashboard = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logUserOut = async (onSuccess = null, onFailure = null) => {
    try {
      await auth.signOut();
      dispatch(logoutUser(navigate, fromDashboard)); // dispatch the action
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("logUserOut error", error);
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return logUserOut;
};

export const useSetUserAvatar = () => {
  const dispatch = useDispatch();

  const setUserAvatar = async (
    user,
    avatarImageUrl,
    onSuccess = null,
    onFailure = null
  ) => {
    try {
      await updateUser(
        {
          ...user,
          avatarImageUrl: avatarImageUrl,
        },
        (returnUser) => {
          dispatch(reduxUpdateUser(returnUser)); // dispatch the action
          if (onSuccess) {
            onSuccess(returnUser);
          }
        },
        (error) => {
          console.error("setUserAvatar error", error);
          if (onFailure) {
            onFailure(error);
          }
        }
      );
    } catch (error) {
      console.error("setUserAvatar error", error);
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return { setUserAvatar };
};

export const handleUpdateRole = async (
  userId,
  newRole,
  onSuccess = null,
  onFailure = null
) => {
  try {
    const updatedUser = {
      isStaff: newRole === "Staff",
      isCustomer: newRole === "Customer",
    };

    await updateDoc(doc(db, "users", userId), updatedUser);

    const allUsers = await getAllUsersFromFirebase();

    if (onSuccess) {
      onSuccess(allUsers);
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};

export {
  getAllUsersFromFirebase,
  addUserToFirebase,
  updateUserInFirebase,
  deleteUserInFirebase,
};
