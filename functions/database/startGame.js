const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const dbRef = firebase.database().ref();

exports.gameState = functions.database.ref('/game/{gameId}/gameState').onUpdate((change, context) => {
    console.log("test")
    const gameId = context.params.gameId;
    const original = change.after.val();
    console.log('Uppercasing', context.params.gameId, original);
    const uppercase = original.toUpperCase();
    return firebase.database().ref("/game/"+gameId+"/gameState").set("voting");
  });
