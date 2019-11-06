let admin = require("./firebase.local.js");
const functions = require('firebase-functions');
const dbTypes = require("./dbTypes.js");
const cors = require('cors')({
    origin: true,
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
});

let db = admin.firestore();


/** getUserInfo 
 *  @deprecated -- use direct request
 * 
 *  GET
 *  requset = url/getUserInfo?user_id="YOUR_USER_ID"
 *      query props:
 *          - user_id 
 *  
 *  response = object with user props from base
 */
exports.getUserInfo = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        let status = 400;

        db.collection(dbTypes.collections.users).doc(req.query.user_id).get()
            .then((snapshot) => {          
                if (snapshot.data() === undefined) {
                    status = 404;
                    throw new Error(JSON.stringify({err: "wrong user"}));
                }
                status = 200;
                res.status(status).send(JSON.stringify(snapshot.data()));
                return snapshot.data();
            }).catch(err => {
                res.status(status).send(JSON.stringify({ err: err.message }));
                return false;
            });    
    })

})

/** createUserInfo
 *  triggers when new user connect to site
 */
exports.createUserInfo = functions.auth.user().onCreate((user) => {
    db.collection(dbTypes.collections.users).doc(user.uid).set(dbTypes.default.defUser);
    return true;
});

/** rateMission
 *  POST
 *  requset = url/rateMission
 *      body:
 *          - "mission_id" of mission should be rated
 *          - "rate" rate number in 1..5
 *      headers:
 *          - "authorization" auth token of user
 *  response = 
 *      - status 200 if ok
 *      - status 400 + payload on error
 */
exports.rateMission = functions.https.onRequest((req, res) => {

    
    cors(req, res, () => {
        let rateValue = parseFloat(req.body.rate);
        let user = {};
        let rateAvg = 0;
        // check input
        console.log(JSON.stringify(req.headers));
        console.log(JSON.stringify(req.body));
        if (req.headers.authorization === undefined ||
            req.body.mission_id === undefined ||
            isNaN(req.body.rate) ||
            rateValue < 1 ||
            rateValue > 5) {
            res.status(400).send(JSON.stringify({ err: "wrong request" }));
            return false;
        }
        // check authToken
        admin.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
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
                throw new Error(JSON.stringify({ err: "user cant rate" }));
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
            return res.send(JSON.stringify({ rateAvg: rateAvg }));
        }).catch(err => {
            res.status(400).send(JSON.stringify({ err: err.message }));
            return false;
        });
        return true;
    });
    
});

/** getMission
 * GET
 * requset = url/getMission
 *      no query props used
 * 
 * headers:
 *      - authorization with token
 * 
 * response
 *      - [ missions ] - JSON of array of missions
 * 
 * only users with user.canAdmin === true can watch other rates
 */
exports.getMissions = functions.https.onRequest((req, res) => {
    let user = {};
    cors(req, res, () => {
        admin.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
            return db.collection(dbTypes.collections.users).doc(decodedToken.uid).get();
        }).then((_user) => {
            user = _user.data();
            if (user === undefined) {
                user = dbTypes.default.defUser;
            }
            if (!user.canRead) {
                return res.status(403).send(JSON.stringify({ err: "you cant read missions" }));
            }
            return db.collection(dbTypes.collections.missions).get()
        }).then((_missions) => {
            let missions = []
            _missions.forEach(_item => {
                let item = _item.data();
                item.guid = _item.id;
                if (!user.canSuperuser) {
                    delete item.rates;
                }

                if (!user.canRate) {
                    item.rateAvg = -1;
                }
                missions.push(item);
            });
            return res.send(JSON.stringify(missions));
        }).catch(err => {
            return res.status(400).send(JSON.stringify({ err: err.message }));
        });
    });
})

/** getSchedule
 * GET
 * requset = url/getSchedule
 *      no query props used
 * 
 * headers:
 *      - authorization with token
 * 
 * response:
 *      - [ {date, [ schedule ] } ] - JSON of array of objects 
 * 
 * only users with user.canAdd === true can get schedule
 */
exports.getSchedule = functions.https.onRequest((req, res) => {
    let user = {};
    cors(req, res, () => {
        admin.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
            return db.collection(dbTypes.collections.users).doc(decodedToken.uid).get();
        }).then((_user) => {
            user = _user.data();
            if (!user.canAdd) {
                return res.status(403).send(JSON.stringify({ err: "you cant read schedule" }));
            }
            return db.collection(dbTypes.collections.schedules).get()
        }).then((_schedules) => {
            let schedules = []
            _schedules.forEach(_item => {
                let item = _item.data();
                item.date = _item.id;
                schedules.push(item);
            });
            return res.send(JSON.stringify(schedules));
        }).catch(err => {
            return res.status(400).send(JSON.stringify({ err: err.message }));
        });
    });
})

/** addMission
 *  POST
 *  requset = url/addMission
 *      headers:
 *          - authorization with token
 *      body:
 *          - "mission" - mission json
 *  response = 
 *      - status 200 + mission id if ok
 *      - status 400 + payload on error
 */
exports.addMission = functions.https.onRequest((req, res) => {
    
    cors(req, res, () => {
        let user = {};
        //check input
        if (req.headers.authorization === undefined ||
            req.body.mission === undefined ||
            !dbTypes.validMission(dbTypes.default.requiredMissionFields, req.body.mission)
        ) {
            return res.status(400).send(JSON.stringify({ err: "Wrong request. Check input" }));
        }
        //check token
        
        admin.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
            return db.collection(dbTypes.collections.users).doc(decodedToken.uid).get();
        }).then((_user) => {
            user = _user.data();
            //check user
            if (user.canAdd) {
                let sanitizedMission = Object.assign({}, dbTypes.default.defMission, req.body.mission);
                //add mission
                return db.collection(dbTypes.collections.missions).add(sanitizedMission)
            } else {
                throw new Error(JSON.stringify({ err: "you cant add missions" }));
            }
        }).then((ref) => {
            return res.send(JSON.stringify({ guid: ref.id }) );
        }).catch(err => {
            return res.status(400).send(JSON.stringify({ err: err.message }));
        });

        // orly?
        return true;
    });
})

/** addSchedule
 *  POST
 *  requset = url/addSchedule
 *      headers:
 *          - authorization with token
 *      body:
 *          - dateMs - date in millisecs
 *          - missions: [ "mission_guid" ] - array of mission guids
 *  response = 
 *      - status 200 + mission id if ok
 *      - status 400 + payload on error
 */
exports.addSchedule = functions.https.onRequest((req, res) => {
    
    cors(req, res, () => {
        let user = {};
        //check input
        if (req.headers.authorization === undefined ||
            req.body.dateMs === undefined ||
            req.body.missions  === undefined
        ) {
            return res.status(400).send(JSON.stringify({ err: "Wrong request. Check input" }));
        }
        //check token
        
        admin.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
            return db.collection(dbTypes.collections.users).doc(decodedToken.uid).get();
        }).then((_user) => {
            user = _user.data();
            //check user
            if (user.canAdd) { 
                //add schedule
                let date = Number(req.body.dateMs).toString();
                return db.collection(dbTypes.collections.schedules).doc(date).set({
                    missions: req.body.missions
                })
            } else {
                throw new Error(JSON.stringify({ err: "you cant add missions to schedule" }));
            }
        }).then(() => {
            // TODO: update only if new lastPlayed > mission.lastPlayed;
            let requests = []
            for (let guid of req.body.missions) {
                requests.push(db.collection(dbTypes.collections.missions)
                    .doc(guid)
                    .update({ lastPlayed: req.body.dateMs }))
            }
            return Promise.all(requests);
        }).then((ref) => {
            return res.send(JSON.stringify({ result: "done" }) );
        }).catch(err => {
            return res.status(400).send(JSON.stringify({ err: err.message }));
        });
        
        //orly
        return true;
    });
})

/** updateLastPlayed
 *  POST
 *  requset = url/updateLastPlayed
 *      headers:
 *          - authorization with token
 *      body:
 *          - "mission_id" 
 *          - "lastPlayed" in ms
 *  response = 
 *      - status 200 if ok
 *      - status 400 + payload on error
 */
exports.updateLastPlayed = functions.https.onRequest((req, res) => {
    
    cors(req, res, () => {
        let user = {};
        let lastPlayed = parseInt(req.body.lastPlayed)

        //check input
        if (req.headers.authorization === undefined ||
            req.body.mission_id === undefined ||
            isNaN(lastPlayed)) {
            return res.status(400).send(JSON.stringify({err: "wrong request" }));
        }
        //check token
        admin.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
            return db.collection(dbTypes.collections.users).doc(decodedToken.uid).get();
        }).then((_user) => {
            user = _user.data();
            //check user
            if (user.canAdd) {
                //update mission
                return db.collection(dbTypes.collections.missions).doc(req.body.mission_id).update({ "lastPlayed": lastPlayed });
            } else {
                throw new Error(JSON.stringify({err: "you cant add missions"}));
            }
        }).then(() => {
            return res.send(JSON.stringify({ result: "done" }));
        }).catch(err => {
            return res.status(400).send(JSON.stringify({ err: err.message }));
        });
        return true;
    });
    
    return false;
})
