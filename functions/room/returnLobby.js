const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const db = firebase.database();
const fs = firebase.firestore();

module.exports = async (req,res)=>{
    functions.logger.debug("Return to lobby");
    const code = req.params.roomcode;
    const snapshot = await db.ref("/room/" + code).get();
    if (snapshot.exists()){
        const data = snapshot.val();
        const gameId = data.gameId;
        functions.logger.info("Delete game " + gameId);
        await db.ref("/game/" + gameId).set(null);
        await db.ref("/room/" + code).update({
            roomState: "waiting",
            gameId: null,
            updateTime: Date.now(),
        });
        return res.send("Return to Lobby");
    }else{
        return res.status(404).send("Room not found");
    }
}