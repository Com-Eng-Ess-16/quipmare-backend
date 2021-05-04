const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const snapshot = await db.ref("/game/" + gameid + "/players").get();
    if (snapshot.exists()){
        const roomSnapshot = await db.ref("/room/" + gameid.slice(0,6)).get();
        const playersData = roomSnapshot.val().players;
        const score = [];
        const players = snapshot.val();
        for (player in Object.keys(players)){
            if (!players[player]){
                continue;
            }
            score.push({
                username: playersData[player].username,
                playerId: player,
                point: players[player].point,
            });
        }
        score.sort((a,b)=> {
            return b.point - a.point;
        })
        return res.json({
            score
        })
    }else{
        return res.status(404).send("GameId not found");
    }
    
}