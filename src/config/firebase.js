import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// production firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlldlFRTUoXUCTmEnopzd1vcKlGavXt6I",
  authDomain: "intro-to-se.firebaseapp.com",
  projectId: "intro-to-se",
  storageBucket: "intro-to-se.appspot.com",
  messagingSenderId: "299200243581",
  appId: "1:299200243581:web:8f3642bf9181cc321fce14",
  measurementId: "G-3Y3GCE0B5W",
  databaseURL: "https://intro-to-se-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// // development firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDSHbEtettIWY8m1pxhLaNBlxICRqX-IXM",
//   authDomain: "buyphone-df8ea.firebaseapp.com",
//   projectId: "buyphone-df8ea",
//   storageBucket: "buyphone-df8ea.appspot.com",
//   messagingSenderId: "287514925498",
//   appId: "1:287514925498:web:e410b84addbc04f9d6e583",
//   measurementId: "G-QSNTTT9X9H"
// };

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { db, rtdb, auth, storage, googleProvider, githubProvider };
