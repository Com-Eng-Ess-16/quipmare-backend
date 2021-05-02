const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const snapshot = await db.ref("/game/" + gameid + "/winner").get();
    if (snapshot.exists()){
        return res.json({
            winner: snapshot.val(),
        })
    }else{
        return res.status(404).send("No winner");
    }
    
}