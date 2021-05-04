const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const answerToVoice = require('../helper/answerToVoice');
const nextState = require('../helper/nextState');
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

exports.processVote = functions.database.ref('/game/{gameId}/questions/{questionId}/{answer}/vote/{playerId}').onWrite(async (change, context) => {
  const gameId = context.params.gameId;
  const questionId = context.params.questionId;
  if (!change.after.val()){
    const roomSnapshot = await db.ref("/room/" + gameId.slice(0,6)).get();
    const voteCountSnap = await db.ref("/game/"+gameId+"/questions/"+questionId+"/voteCount").get();
    const voteCount = voteCountSnap.val();
    const allPlayer = roomSnapshot.val().allPlayer;
    if (allPlayer-3 <= voteCount){
      await nextState(gameId);
    }
    return await db.ref("/game/"+gameId+"/questions/"+questionId+"/voteCount").set(voteCount+1);
  }else{
    return null;
  }
});
