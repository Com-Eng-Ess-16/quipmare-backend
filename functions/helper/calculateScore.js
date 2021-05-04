const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (gameid, questionIndex) => {
    const snapshot = await db.ref("/game/" + gameid + "/questions/" + questionIndex).get();
    const roomSnapshot = await db.ref("/room/" + gameid.slice(0,6)).get();
    const allPlayer = Object.keys(roomSnapshot.val().players).length;
    const noA = !snapshot.val().a.answer;
    const noB = !snapshot.val().b.answer;
    const voterA = snapshot.val().a.vote ? Object.keys(snapshot.val().a.vote): [];
    const voterB = snapshot.val().b.vote ? Object.keys(snapshot.val().b.vote): [];
    let voteA = voterA.length
    let voteB = voterB.length
    if (!noA || !noB){
        if (noA){
            voteB = 1;
        }else if(noB){
            voteA = 1;
        }
    }
    let winnerBonus = 100;
    const totalVote = voteA + voteB ? voteA + voteB : 1;
    const playerVote = voterA.concat(voterB).filter(a => {return a.toString().length< 2}).length
    if (playerVote >= allPlayer-2){
        winnerBonus = 250; 
    }
    if ( noA || noB){
        winnerBonus = 0;
    }
    let pointA = parseInt(voteA / totalVote * 1000)
    let pointB = parseInt(voteB / totalVote * 1000)
    if (voteA > voteB){
        pointA += winnerBonus;
    } else if(voteA < voteB){
        pointB += winnerBonus;
    }
    await db.ref("/game/" + gameid + "/questions/" + questionIndex +"/a/point").set(pointA)
    await db.ref("/game/" + gameid + "/questions/" + questionIndex +"/b/point").set(pointB)
    const ownerAPoint = await db.ref("/game/" + gameid + "/players/" + snapshot.val().a.owner +"/point").get();
    const ownerBPoint = await db.ref("/game/" + gameid + "/players/" + snapshot.val().b.owner +"/point").get();
    await db.ref("/game/" + gameid + "/players/" + snapshot.val().a.owner +"/point").set(ownerAPoint.val() + pointA);
    await db.ref("/game/" + gameid + "/players/" + snapshot.val().b.owner +"/point").set(ownerBPoint.val() + pointB);
    return null;
}