const firebase = require("firebase-admin");
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
                }else{
                    nextState = "answer"
                    await db.ref("/game/" + gameid + "/roundRemain").set(roundRemain-1);
                }
            }
        }
        const timeDict = {
            "voting": 25,
            "result": 15,
            "score": 15,
        }
        if (!!timeDict[nextState]){
            await db.ref("/game/" + gameid + "/deadlineTime").set(timeDict[nextState]);
        }
        await db.ref("/game/" + gameid + "/gameState").set(nextState);
        return res.json({
            nextState
        })
    }else{
        return res.status(404).send("GameId not found");
    }
    
}