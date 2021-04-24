const functions = require('firebase-functions');
const firebase = require("firebase-admin");
firebase.initializeApp({
    databaseURL: functions.config().project.databaseurl,
    storageBucket: functions.config().project.storagebucket
})

const room = require("./room");
const game = require("./game");
const question = require("./question");

exports.room = functions.region("asia-east2").https.onRequest(room);
exports.game = functions.region("asia-east2").https.onRequest(game);
exports.question = functions.region("asia-east2").https.onRequest(question);
exports.database = require("./database");