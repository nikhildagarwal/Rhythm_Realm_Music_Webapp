admin = require("firebase-admin");

var serviceAccount = require("../json/firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rhythm-realm-12f0b-default-rtdb.firebaseio.com"
});

module.exports = { admin};