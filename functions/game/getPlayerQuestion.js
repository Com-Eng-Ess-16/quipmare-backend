const firebase = require("firebase-admin");
const db = firebase.database();
const fs = firebase.firestore();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const playerId = req.params.playerId;
    const snapshot = await db.ref("/game/" + gameid).get();
    if (snapshot.exists()){
        const players = snapshot.val().players;
        const player = players[playerId]
        const questions = snapshot.val().questions;
        const playerQuestion = [];
        for (let i=0;i<2;i++){
            const questionIndex = player.questions[i].questionIndex;
            const question = questions[questionIndex].questionPrompt
            playerQuestion.push({
                question,
                questionIndex
            });
        }
        return res.json({
            playerQuestion
        })
    }else{
        return res.status(404).send("GameId not found");
    }
    
}