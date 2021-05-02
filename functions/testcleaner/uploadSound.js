const functions = require('firebase-functions');
const firebase = require("firebase-admin")
const storageRef = firebase.storage().bucket();
const soundBase64 = functions.config().test.base64sound
module.exports = async (req, res) => {
    if(!soundBase64){
        return res.status(401).send("For test");
    }
    const byteCharacters = Buffer.from(soundBase64, 'base64')
    const file = storageRef.file("test3.mp3");
    await file.save(byteCharacters);
    await file.makePublic();
    const link = await file.publicUrl();
    return res.send(link)
}
