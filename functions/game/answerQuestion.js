const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const data = req.body
    let {questionOrder, playerId, answer} = data;
    const snapshot = await db.ref("/game/" + gameid + "/players").get();
    if (snapshot.exists()){
        const players = snapshot.val();
        const player = players[playerId]
        const question = player.questions[questionOrder];
        const questionIndex = question.questionIndex;
        const answerOrder = question.answer;
        await db.ref("/game/" + gameid + "/questions/" + questionIndex + "/" + answerOrder + "/answer").set(answer);
        return res.send("Success answer");
    }else{
        return res.status(404).send("GameId not found");
    }
    
}