const functions = require('firebase-functions');
const firebase = require("firebase-admin");

exports.player = functions.database.ref('/room/{roomId}/players/{player}').onWrite(async (change, context) => {
  const roomId = context.params.roomId;
  const allPlayerSnap = await firebase.database().ref("/room/"+roomId+"/allPlayer").get();
  if (!allPlayerSnap.exists()){
    return null;
  }
  let allPlayer = allPlayerSnap.val();
  //Delete
  if (!change.after.exists()){
    return firebase.database().ref("/room/"+roomId+"/allPlayer").set(allPlayer - 1);
  }  
  //Create
  if (!change.before.exists()){
    return firebase.database().ref("/room/"+roomId+"/allPlayer").set(allPlayer + 1);
  }
});

exports.spectate = functions.database.ref('/room/{roomId}/spectator/{spectate}').onWrite(async (change, context) => {
  const roomId = context.params.roomId;
  const allPlayerSnap = await firebase.database().ref("/room/"+roomId+"/allPlayer").get();
  if (!allPlayerSnap.exists()){
    return null;
  }
  let allPlayer = allPlayerSnap.val();
  //Delete
  if (!change.after.exists()){
    return firebase.database().ref("/room/"+roomId+"/allPlayer").set(allPlayer - 1);
  }  
  //Create
  if (!change.before.exists()){
    return firebase.database().ref("/room/"+roomId+"/allPlayer").set(allPlayer + 1);
  }
});
