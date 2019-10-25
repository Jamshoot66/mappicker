
let admin = require("./firebase.local.js");
const functions = require('firebase-functions');
const dbTypes = require("./dbTypes.js");

let db = admin.firestore();

/** getUserInfo
 *  GET
 *  requset = url/getUserInfo?user_id="YOUR_USER_ID"
 *      query props:
 *          - user_id 
 *  response = object with user props from base
 */
exports.getUserInfo = functions.https.onRequest((req, res) => {
    let status = 400;
    db.collection(dbTypes.collections.users).doc(req.query.user_id).get()
        .then((snapshot) => {          
            if (snapshot.data() === undefined) {
                status = 404;
                throw new Error("wrong user");
            }
            status = 200;
            res.status(status).send(snapshot.data());
            return snapshot.data();
        }).catch(err => {
            res.status(status).send(err.message);
            return false;
        });  
})

/** createUserInfo
 *  triggers when new user connect to site
 */
exports.createUserInfo = functions.auth.user().onCreate((user) => {
    db.collection(dbTypes.collections.users).doc(user.uid).set(dbTypes.default.defUser);
});

/** rateMission
 *  POST
 *  requset = url/rateMission
 *      body:
 *          - "mission_id" of mission should be rated
 *          - "rate" rate number in 1..5
 *          - "token" auth token of user
 *  response = 
 *      - status 200 if ok
 *      - status 400 + payload on error
 */
exports.rateMission = functions.https.onRequest((req, res) => {
    
    let rateValue = parseFloat(req.body.rate);
    let user = {};
    let rateAvg = 0;
    // check input
    if (req.body.token === undefined ||
        req.body.mission_id === undefined ||
        isNaN(req.body.rate) ||
        rateValue < 1 ||
        rateValue > 5) {
        res.status(400).send("wrong request");
        return false;
    }
    
    // check authToken
    admin.auth().verifyIdToken(req.body.token).then((decodedToken) => {
        let uid = decodedToken.uid;
        // check user can rate
        return db.collection(dbTypes.collections.users).doc(uid).get()
    }).then((_user) => {
        user = _user.data();
        user.unit = user.unit.toLowerCase();
        if (user.canRate === true) {
            //get mission from base to rate it
            return db.collection(dbTypes.collections.missions).doc(req.body.mission_id).get()
        } else {
            throw new Error("user cant rate");
        }
    }).then((item) => {
        let rates = item.data().rates;
        rates[user.unit] = rateValue;
        
        let ratesArr = Object.values(rates);
        
        //count avarage rate
        //add votes with rate "3" if there less then 4 voices 
        let summ = ratesArr.reduce((sum, value) => {
            return sum += value;
        }, 0);

        if (ratesArr.length <= 4) {
            rateAvg = (summ + (4 - ratesArr.length) * 3) / 4.0;
            
        } else {
            rateAvg = summ / ratesArr.length;
        }
        console.log(rateAvg);       
        // add or update mission in db
        return db.collection(dbTypes.collections.missions).doc(req.body.mission_id).update({
            "rates": rates,
            "rateAvg": rateAvg
        })
    }).then(() => {
        return res.send({rateAvg: rateAvg});
    }).catch(err => {
        res.status(400).send(err.message);
        return false;
    })

    return true;
})