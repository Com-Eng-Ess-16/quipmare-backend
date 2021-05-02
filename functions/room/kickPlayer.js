const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");

module.exports = async (req,res)=>{
    const code = req.params.roomcode;
    const snapshot = await dbRef.child(code).get();
    const data = req.body
    let {playerId} = data;
    functions.logger.debug("kickPlayer " + playerId);
    console.log(snapshot.val())
    if (snapshot.exists()){
        if (snapshot.val().roomState === "playing"){
            const snapshotGame = await firebase.database().ref("/game/" + snapshot.val().gameId + "/gameState").get()
            if (snapshotGame.val() !== "podium"){
                return res.status(403).send("Ingame progress");
            }
        }
        if (playerId == 0){
            await dbRef.child(code).set(null);
            return res.send("remove room");
        }else if (playerId.length > 2){
            await dbRef.child(code+"/spectator/"+playerId).set(null);
            return res.send("kick " + playerId);
        }else if (!!playerId){
            await dbRef.child(code+"/players/"+playerId).set(null);
            return res.send("kick " + playerId);
        }else{
            return res.send("no player kick");

        }
    }
    return res.status(404).send("Room not found");
}