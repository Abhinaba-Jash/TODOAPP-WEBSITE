const express = require("express");
const router = express.Router();
const path = require("path"); //D
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword
} = require("firebase/auth");
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const admin = require("../firebase");
const db = admin.database();

function checkPasswordsMatch(password, c_password) {
  return password === c_password;
}
router.post("/signup", async (req, res) => {
  const { username, email, password, c_password } = req.body;
  if (checkPasswordsMatch(password, c_password)) {
    const userData = {
      username: username,
      email: email,
      todos: "",
    };
    try {
      const userRecord = await admin
        .auth()
        .createUser({ email, password })
        .then((userRecord) => {
          uid = userRecord.uid;
          return db.ref(`users/${uid}`).set(userData);
        })
        .then(() => {
        })
        .catch((error) => {
          console.log(error);
        });

      res.status(201).send(userRecord);
    } catch (error) {
      res.status(400).send(error.message);
    }
  } else {
    alert("Password didn't matched!!! Confirm your password properly.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    res.status(200).json({ idToken: idToken, uid: userCredential.user.uid});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("uid");
  res.status(200).send("Redirecting to login page..."); //D
});

module.exports = router;
