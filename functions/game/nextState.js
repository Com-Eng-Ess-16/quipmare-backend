const firebase = require("firebase-admin");
const addTime = require("../helper/addTime");
const calculateScore = require("../helper/calculateScore");
const convertDataToFirestore = require("../helper/convertDataToFirestore");
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const snapshot = await db.ref("/game/" + gameid).get();
    if (snapshot.exists()){
        const gameState = snapshot.val().gameState;
        const questionState = snapshot.val().questionState;
        let nextState;
        const nextDict = {
            "answer": "voting",
            "voting": "result",
        }
        nextState = nextDict[gameState];
        if (!nextState){
            if (gameState === "result"){
                if (questionState+1 >= Object.keys(snapshot.val().questions).length){
                    nextState = "score"
                }else{
                    await db.ref("/game/" + gameid + "/questionState").set(questionState+1);
                    nextState = "voting"
                }
            }else if(gameState === "score"){
                const roundRemain = snapshot.val().roundRemain;
                if (roundRemain-1 <= 0){
                    nextState = "podium"
                    const id = await convertDataToFirestore(snapshot.val().questions);
                    await db.ref("/game/" + gameid + "/archiveId").set(id);
                }else{
                    nextState = "answer"
                    await db.ref("/game/" + gameid + "/roundRemain").set(roundRemain-1);
                }
            }
        }
        if(nextState === "result"){
            await calculateScore(gameid, questionState);
        }
        const timeDict = {
            "voting": 35,
            "result": 15,
            "score": 15,
        }
        if (!!timeDict[nextState]){
            await db.ref("/game/" + gameid + "/deadlineTime").set(addTime(timeDict[nextState]));
        }
        await db.ref("/game/" + gameid + "/gameState").set(nextState);
        return res.json({
            nextState
        })
    }else{
        return res.status(404).send("GameId not found");
    }
    
}