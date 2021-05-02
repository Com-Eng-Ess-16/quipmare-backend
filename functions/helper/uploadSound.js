const functions = require('firebase-functions');
const firebase = require("firebase-admin")
const storageRef = firebase.storage().bucket();

module.exports = async (base64, filePath) => {
    const byteCharacters = Buffer.from(base64, 'base64')
    const file = storageRef.file(filePath);
    await file.save(byteCharacters);
    await file.makePublic();
    const link = await file.publicUrl();
    return link;
}
