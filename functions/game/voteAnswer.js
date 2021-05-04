const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const calculateScore = require("../helper/calculateScore");
const nextState = require('../helper/nextState');
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const data = req.body
    let {questionIndex, playerId, answer} = data;
    functions.logger.debug("voteAnswer "+ gameid + playerId + questionIndex + answer);
    const snapshot = await db.ref("/game/" + gameid).get();
    if (snapshot.exists()){
        if (snapshot.val().gameState !== "voting"){
            return res.status(400).send("Can't Vote now");
        }
        const questionData = snapshot.val().questions[questionIndex]
        const allVote = getAllvote(questionData);
        if (allVote.has(playerId)){
            return res.status(403).send("Already Vote");
        }
        if (playerId == questionData.a.owner || playerId == questionData.b.owner ){
            return res.status(403).send("Can't vote your own question");
        }
        await db.ref("/game/" + gameid + "/questions/" + questionIndex + "/" + answer + "/vote/" + playerId).set(true);
        return res.send("Success Vote");
    }else{
        return res.status(404).send("GameId not found");
    }
}

const getAllvote = (question) => {
    let voteA = question['a']["vote"];
    let voteB = question['b']["vote"];
    if (!voteA){
        voteA = {}
    }
    if (!voteB){
        voteB = {}
    }
    const pvoteA = Object.keys(voteA);
    const pvoteB = Object.keys(voteB);
    return new Set(pvoteA.concat(pvoteB));
}