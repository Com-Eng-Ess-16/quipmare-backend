const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");

module.exports = async (req,res)=>{
    const code = req.params.roomcode;
    const snapshot = await dbRef.child(code).get();
    if (snapshot.exists()){
        const {gameId} = snapshot.val();
        return res.json({
            gameId,
        });
    }
    return res.status(404).send("Room not found");
}
