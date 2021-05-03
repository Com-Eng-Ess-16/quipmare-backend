const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const texttoSpeech = require('./texttoSpeech');
const uploadSound = require('./uploadSound');
const nextState = require('../helper/nextState');
const db = firebase.database();

module.exports = async (gameId) => {
    const snap = await db.ref("/game/" + gameId + "/questions").get();
    const questions = snap.val();
    for (let i in Object.keys(questions)){
        const answerA = questions[i].a.answer;
        const answerB = questions[i].b.answer;
        // "ssml": "<speak> ระหว่าง <break time=\"200ms\"/> ตัวเลือกที่ 1 <break time=\"200ms\"/> หรือว่า <break time=\"200ms\"/> ตัวเลือกที่ 2 </speak>"
        const message = toSsml(answerA,answerB);
        const result = await texttoSpeech(message, "ssml");
        const link = await uploadSound(result.audioContent, gameId + "/" +i +".mp3")
        await db.ref("/game/" + gameId + "/questions/" + i + "/voiceUrl").set(link);
        if (i == 0){
            await nextState(gameId);
        }
    }
}

const toSsml = (answerA, answerB) => {
    if (!answerA && !answerB){
        return "<speak> เสียใจจัง <break time=\"100ms\"/> ไม่มีใครตอบเลย </speak>";
    } else if(!answerA){
        return "<speak> มีแต่ " +answerB+ "ให้เลือก </speak>";
    } else if(!answerB){
        return "<speak> มีแต่ " +answerA+ "ให้เลือก </speak>";
    }else{
        return "<speak> ระหว่าง <break time=\"100ms\"/> "+answerA+" <break time=\"100ms\"/> หรือว่า <break time=\"100ms\"/> "+answerB+" </speak>";
    }
}