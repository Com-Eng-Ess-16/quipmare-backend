const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (gameid, questionIndex) => {
    const snapshot = await db.ref("/game/" + gameid + "/questions/" + questionIndex).get();
    const roomSnapshot = await db.ref("/room/" + gameid.slice(0,6)).get();
    const allPlayer = roomSnapshot.val().allPlayer;
    const voteA = snapshot.val().a.vote ? snapshot.val().a.vote.length : 0;
    const voteB = snapshot.val().b.vote ? snapshot.val().b.vote.length : 0;
    let winnerBonus = 0;
    const totalVote = voteA + voteB ? voteA + voteB : 1;
    if (totalVote >= allPlayer){
        winnerBonus = 250;
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