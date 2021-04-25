const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");

module.exports = async (req,res)=>{
    const code = req.params.roomcode;
    const snapshot = await dbRef.child(code).get();
    const exist = snapshot.exists();
    return res.json({
        exist
    });
}