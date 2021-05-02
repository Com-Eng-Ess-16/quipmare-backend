const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const uploadSound = require('../helper/uploadSound');
const storageRef = firebase.storage().bucket();
const soundBase64 = functions.config().test.base64sound
module.exports = async (req, res) => {
    if(!soundBase64){
        return res.status(401).send("For test");
    }
    const link = await uploadSound(soundBase64, "test3.mp3");
    return res.send(link)
}
