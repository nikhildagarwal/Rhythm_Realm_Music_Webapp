admin = require("firebase-admin");

var serviceAccount = require("../rhythm-realm-12f0b-firebase-adminsdk-ygdmg-8931683b9b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rhythm-realm-12f0b-default-rtdb.firebaseio.com"
});

module.exports = { admin};