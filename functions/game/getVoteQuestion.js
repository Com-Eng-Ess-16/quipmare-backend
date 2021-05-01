const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const questionIndex = req.params.questionIndex;
    const snapshot = await db.ref("/game/" + gameid + "/questions/" + questionIndex).get();
    if (snapshot.exists()){
        const question = snapshot.val()
        return res.json({
            question
        })
    }else{
        return res.status(404).send("GameId or question not found");
    }
    
}