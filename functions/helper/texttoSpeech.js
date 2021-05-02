const functions = require('firebase-functions');
const axios = require("axios");

module.exports = async (message, type) => {
    const url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + functions.config().api.key;
    let input = {};
    input[type] = message; 
    const data = {
        input,
        // voice: {languageCode: 'ja-JP', ssmlGender: 'FEMALE'},
        "voice": {
            "languageCode": "th-TH",
            "name": "th-TH-Standard-A"
          },
        audioConfig: {
            audioEncoding: 'MP3',
            "pitch": -0.4,
            "speakingRate": 0.85},
      }
    const response = await axios.post(url, data)
    return response.data
}