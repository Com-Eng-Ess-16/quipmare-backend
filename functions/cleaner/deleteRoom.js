const firebase = require("firebase-admin")
const db = firebase.database()

module.exports = async (room) => {
    const wait = await db.ref("/room/" + room).remove();
    return wait;
}