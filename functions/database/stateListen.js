const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const answerToVoice = require('../helper/answerToVoice');
const db = firebase.database();

exports.processTts = functions.database.ref('/game/{gameId}/processVoice').onWrite(async (change, context) => {
  const gameId = context.params.gameId;
  if (change.after.val() === "true"){
    await answerToVoice(gameId);
    return await db.ref("/game/"+gameId+"/processVoice").set(null);
  }else{
    return null;
  }
});
