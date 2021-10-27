var firebase = require("firebase-admin");

var serviceAccount = require("../keys/pockettrackauth-firebase-key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

module.exports = firebase