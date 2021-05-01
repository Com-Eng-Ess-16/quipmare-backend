const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const data = req.body
    let {questionOrder, playerId, answer} = data;
    const snapshot = await db.ref("/game/" + gameid).get();
    if (snapshot.exists()){
        if (snapshot.val().gameState !== "answer"){
            return res.status(400).send("Can't answer now");
        }
        const players = snapshot.val().players;
        const answerNumber = snapshot.val().answerNumber ? snapshot.val().answerNumber : 0;
        const player = players[playerId]
        const question = player.questions[questionOrder];
        const questionIndex = question.questionIndex;
        const answerOrder = question.answer;
        await db.ref("/game/" + gameid + "/questions/" + questionIndex + "/" + answerOrder + "/answer").set(answer);
        if (answerNumber + 1 >= Object.keys(players).length*2 ) {
            await db.ref("/game/" + gameid + "/gameState").set("voting");
        }
        await db.ref("/game/" + gameid + "/answerNumber").set(answerNumber + 1);
        
        return res.send("Success answer");
    }else{
        return res.status(404).send("GameId not found");
    }
    
}