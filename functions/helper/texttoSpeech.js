const functions = require('firebase-functions');
const axios = require("axios");

module.exports = async (message, type) => {
    const url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + functions.config().api.key;
    let inputDict = {};
    inputDict[type] = message; 
    const data = {
        "input": {
            // "ssml": "<speak> ระหว่าง <break time=\"200ms\"/> ตัวเลือกที่ 1 <break time=\"200ms\"/> หรือว่า <break time=\"200ms\"/> ตัวเลือกที่ 2 </speak>"
            inputDict
          },
        // voice: {languageCode: 'ja-JP', ssmlGender: 'FEMALE'},
        "voice": {
            "languageCode": "th-TH",
            "name": "th-TH-Standard-A"
          },
        audioConfig: {
            audioEncoding: 'MP3',
            "pitch": -0.4,
            "speakingRate": 1},
      }
    const response = await axios.post(url, data)
    return response.data
}