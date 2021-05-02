const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");

module.exports = async (req,res)=>{
    const code = req.params.roomcode;
    const snapshot = await dbRef.child(code).get();
    const data = req.body
    let {playerId} = data;
    if (snapshot.exists()){
        if (snapshot.val().roomState !== "playing"){
            return await kick(playerId, res)
        } else {
            const snapshotGame = await firebase.database().ref("/game/" + snapshot.val().gameId + "gameState").get()
            if (snapshotGame.val() === "podium"){
                return await kick(playerId, res)
            }
            return res.status(403).send("Ingame progress");
        }
    }
    return res.status(404).send("Room not found");
}

const kick = async (playerId, res) => {
    if (playerId == 0){
        await dbRef.child(code).set(null);
        return res.send("remove room");
    }else if (playerId.toString().length){
        await dbRef.child(code+"/players/"+playerId).set(null);
        return res.send("kick " + playerId);
    }else if (!!playerId){
        await dbRef.child(code+"/players/"+playerId).set(null);
        return res.send("kick " + playerId);
    }else{
        return res.send("no player kick");
    }
}