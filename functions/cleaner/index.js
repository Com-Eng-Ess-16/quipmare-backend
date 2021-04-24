const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const db = firebase.database()
const deleteRoom = require("./deleteRoom")
module.exports = async context => {
    const now = Date.now();
    const late = now - 3600000;
    const snap = await db.ref("/room").get();
    const rooms = snap.val();
    const deletedRoom = [];
    Object.keys(rooms).forEach(room => {
        if (rooms[room]["updateTime"] < late){
            deletedRoom.push(room);
        }
    })
    const promises = [];
    deletedRoom.forEach(room => promises.push(deleteRoom(room)));
    await Promise.all(promises)
    functions.logger.info("Cleared room" + deletedRoom);
    return null
}