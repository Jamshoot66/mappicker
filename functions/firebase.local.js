let serviceAccount = require("./.private/mapick-rb-firebase-adminsdk-756qp-d29dbde21a.json");

const admin = require('firebase-admin');

let _admin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mapick-rb.firebaseio.com"
});

module.exports = _admin;