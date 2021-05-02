const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const texttoSpeech = require('./texttoSpeech');
const uploadSound = require('./uploadSound');
const db = firebase.database();

module.exports = async (gameId) => {
    const snap = await db.ref("/game/" + gameId + "/questions").get();
    const questions = snap.val();
    for (let i in Object.keys(questions)){
        const answerA = questions[i].a.answer;
        const answerB = questions[i].b.answer;
        // "ssml": "<speak> ระหว่าง <break time=\"200ms\"/> ตัวเลือกที่ 1 <break time=\"200ms\"/> หรือว่า <break time=\"200ms\"/> ตัวเลือกที่ 2 </speak>"
        const message = "<speak> ระหว่าง <break time=\"100ms\"/> "+answerA+" <break time=\"100ms\"/> หรือว่า <break time=\"100ms\"/> "+answerB+" </speak>"
        const result = await texttoSpeech(message, "ssml");
        const link = await uploadSound(result.audioContent, gameId + "/" +i +".mp3")
        await db.ref("/game/" + gameId + "/questions/" + i + "/voiceUrl").set(link);
    }
}

const toSsml = (answerA, answerB) => {
    return "<speak> ระหว่าง <break time=\"200ms\"/> "+answerA+" <break time=\"200ms\"/> หรือว่า <break time=\"200ms\"/> "+answerB+" </speak>";
}