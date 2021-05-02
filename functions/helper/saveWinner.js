const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (gameid)=>{
    const snapshot = await db.ref("/game/" + gameid + "/players").get();
    if (snapshot.exists()){
        const roomSnapshot = await db.ref("/room/" + gameid.slice(0,6)).get();
        const playersData = roomSnapshot.val().players;
        const score = [];
        const players = snapshot.val();
        for (player in Object.keys(players)){
            score.push({
                username: playersData[player].username,
                color: playersData[player].color,
                playerId: player,
                point: players[player].point,
            });
        }
        score.sort((a,b)=> {
            return b.point - a.point;
        })
        const winner = score[0];
        await db.ref("/game/" + gameid + "/winner").set(winner);
        return winner;
    }else{
        return null;
    }
    
}