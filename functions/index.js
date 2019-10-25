
let admin = require("./firebase.local.js");
const functions = require('firebase-functions');
const dbTypes = require("./dbTypes.js");

let db = admin.firestore();

/** getUserInfo usage:
 *  url?user_id="YOUR_USER_ID"
 * 
 *  returns object with user from base
 */
exports.getUserInfo = functions.https.onRequest((req, res) => {
    let status = 400;
    console.log(req.query.user_id);
    db.collection(dbTypes.collections.users).doc(req.query.user_id).get()
        .then((snapshot) => {          
            if (snapshot.data() === undefined) {
                status = 404;
                throw new Error("wrong user");
            }
            status = 200;
            res.status(status).send(snapshot.data());
            return true;
        }).catch(err => {
            res.status(status).send(err.message);
            return false;
        });  
})