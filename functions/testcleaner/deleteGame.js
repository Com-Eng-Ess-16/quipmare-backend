const firebase = require("firebase-admin");
const db = firebase.database()

module.exports = async (req, res) => {
    const snap = await db.ref("/room").get();
    const rooms = snap.val();
    const deletedGame = [];
    const roomSet = new Set();
    if (!!rooms){
        Object.keys(rooms).forEach(room => {
            roomSet.add(room);
        })
    }
    const snapGame = await db.ref("/game").get();
    const games = snapGame.val();
    Object.keys(games).forEach(game => {
        if(!roomSet.has(game.slice(0,6))){
            deletedGame.push(game);
        }
    })
    const promises = [];
    deletedGame.forEach(game => promises.push(deleteGame(game)));
    await Promise.all(promises)
    return res.json({
        deletedGame
    })
}

const deleteGame = async (game) => {
    const wait = await db.ref("/game/" + game).remove();
    return wait;
}