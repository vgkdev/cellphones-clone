import {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  getNewUserDataStart,
  getNewUserDataFailure,
  getNewUserDataSuccess,
  logoutUserTrigger,
  addVoucherToUser,
} from "../slices/userSlice";

import {
  auth,
  db,
  googleProvider,
  githubProvider,
} from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { User } from "../../models/User";
import { getUserById } from "../../db/dbUser";

export const signInUser =
  (data, navigate, remember = false, isShopping = false) =>
  async (dispatch) => {
    dispatch(loginStart());
    return signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("User signed in: ", docSnap.data());
          dispatch(registerSuccess(docSnap.data()));
          if (remember) {
            console.log(">>>check user login in: ", docSnap.data());
            localStorage.setItem("UserToken", JSON.stringify(docSnap.data()));
          }
          if (isShopping) {
            navigate("/");
          } else {
            navigate("/dashboard");
          }
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        throw new Error(errorMessage);
      });
  };

export const getNewUserData = (id, onSuccess = null, onFailure = null) => {
  return async (dispatch) => {
    dispatch(getNewUserDataStart());
    try {
      getUserById(
        id,
        (user) => {
          if (user) {
            if (onSuccess) {
              dispatch(getNewUserDataSuccess(user));
              onSuccess(user);
            }
          } else {
            if (onFailure) {
              onFailure("User not found");
            }
          }
        },
        (error) => {
          dispatch(getNewUserDataFailure(error));
        }
      );
    } catch (error) {
      dispatch(getNewUserDataFailure(error.message));
      console.error("Error updating user: ", error);
      if (onFailure) {
        onFailure(error);
      }
    }
  };
};

export const googleSignIn =
  (navigate, remember = false) =>
  async (dispatch) => {
    dispatch(loginStart());
    return signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("User signed in: ", docSnap.data());
          dispatch(registerSuccess(docSnap.data()));
          if (remember) {
            localStorage.setItem("UserToken", JSON.stringify(docSnap.data()));
          }
          navigate("/dashboard");
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        throw new Error(errorMessage);
      });
  };

export const githubSignIn =
  (navigate, remember = false) =>
  async (dispatch) => {
    dispatch(loginStart());
    return signInWithPopup(auth, githubProvider)
      .then(async (result) => {
        const user = result.user;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("User signed in: ", docSnap.data());
          dispatch(registerSuccess(docSnap.data()));
          if (remember) {
            localStorage.setItem("UserToken", JSON.stringify(docSnap.data()));
          }
          navigate("/dashboard");
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        throw new Error(errorMessage);
      });
  };

export const updateUser = (data, toast, navigate) => async (dispatch) => {
  dispatch(updateUserStart());
  dispatch(updateUserSuccess(data));
};

export const updateUserToFirebase = (
  user,
  onSuccess = null,
  onFailure = null
) => {
  return async (dispatch) => {
    dispatch(updateUserStart());
    try {
      await updateDoc(doc(db, "users", user.id), user);
      dispatch(updateUserSuccess(user));
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.error("Error updating user: ", error);
      if (onFailure) {
        onFailure(error);
      }
    }
  };
};

export const addVoucherToFirebase = (
  voucherId,
  onSuccess = null,
  onFailure = null
) => {
  return async (dispatch, getState) => {
    dispatch(addVoucherToUser(voucherId));
    const { user } = getState().user;
    dispatch(
      updateUserToFirebase(
        user,
        (user) => {
          if (onSuccess) {
            onSuccess(user);
          }
        },
        (error) => {
          if (onFailure) {
            onFailure(error);
          }
        }
      )
    );
  };
};

export const signUpUser = (data, navigate) => async (dispatch) => {
  dispatch(registerStart());
  createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;
      const userObj = new User();

      /**
       * id: user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
       */

      userObj.id = user.uid;
      userObj.email = data.email;
      userObj.firstName = data.firstName;
      userObj.lastName = data.lastName;
      userObj.displayName = data.firstName + " " + data.lastName;

      setDoc(doc(db, "users", user.uid), userObj.data())
        .then(async (res) => {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            dispatch(registerSuccess(docSnap.data()));
            localStorage.setItem("UserToken", JSON.stringify(docSnap.data()));
            navigate("/");
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("set doc error: ", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

export const forgotPassword = (data) => async (dispatch) => {
  return sendPasswordResetEmail(auth, data.email)
    .then(() => {
      console.log("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // console.log(errorMessage);
      throw new Error(errorMessage);
    });
};

export const logoutUser =
  (navigate, fromDashboard = false) =>
  async (dispatch) => {
    dispatch(logoutUserTrigger());
    auth.signOut().then(() => {
      localStorage.removeItem("UserToken");
      if (fromDashboard) {
        navigate("/dashboard/sign-in");
      } else {
        navigate("/");
      }
    });
  };
