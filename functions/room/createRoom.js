const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");

module.exports = async (req,res)=>{
    functions.logger.debug("createRoom");
    let code = randomString(6);
    let snapshot = await dbRef.child(code).get();
    while (snapshot.exists()){
        code = randomString(6);
        snapshot = await dbRef.child(code).get();
    }
    dbRef.child(code).set({
        roomState: "waiting",
        allPlayer: 0,
        updateTime: Date.now(),
    })
    return res.json({
        roomcode :code
    });
}

const randomString = (length) => {
    let ran = "";
    for (let i=0;i<length;i++){
        ran += String.fromCharCode(64 + Math.ceil(Math.random()*26));
    }
    return ran;
}