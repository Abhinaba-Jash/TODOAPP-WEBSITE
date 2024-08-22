// src/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../todoapp-bf810-firebase-adminsdk-zi6sy-8802805734.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://todoapp-bf810-default-rtdb.firebaseio.com/"
});


module.exports = admin;
