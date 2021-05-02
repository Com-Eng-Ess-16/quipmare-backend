const functions = require('firebase-functions');
const firebase = require("firebase-admin");
firebase.initializeApp({
    databaseURL: functions.config().project.databaseurl,
    storageBucket: functions.config().project.storagebucket,
    apiKey: functions.config().project.apikey
})

const room = require("./room");
const game = require("./game");
const question = require("./question");
const cleaner = require("./cleaner");
const testcleaner = require("./testcleaner");
const archive = require("./archive");

exports.room = functions.region("asia-east2").https.onRequest(room);
exports.game = functions.region("asia-east2").https.onRequest(game);
exports.question = functions.region("asia-east2").https.onRequest(question);
exports.database = require("./database");
exports.archive = functions.region("asia-east2").https.onRequest(archive);
exports.testcleaner = functions.region("asia-east2").https.onRequest(testcleaner);
exports.cleaner = functions
    .region("asia-east2")
    .pubsub.schedule("0 0 * * *")
    .timeZone("Asia/Bangkok")
    .onRun(cleaner)
// .pubsub.schedule("0 */5 * * *")