// Require Firebase modules
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { getDatabase, ref, get, child } = require("firebase/database");

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDMtslnGtT8rz_GVg0rxmFrJ_1-8PlpM7g",
  authDomain: "todoapp-bf810.firebaseapp.com",
  databaseURL: "https://todoapp-bf810-default-rtdb.firebaseio.com",
  projectId: "todoapp-bf810",
  storageBucket: "todoapp-bf810.appspot.com",
  messagingSenderId: "518213812816",
  appId: "1:518213812816:web:238eb77a62318298cd8755",
  measurementId: "G-2XC73QVTPQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export the auth and database objects
module.exports = {
  auth,
  database,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  ref,
  get,
  child,
};
