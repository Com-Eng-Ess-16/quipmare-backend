const texttoSpeech = require('../helper/texttoSpeech');
const functions = require('firebase-functions');
const uploadSound = require('../helper/uploadSound');

module.exports = async (req, res) => {
    const data = req.body
    let {message, fileName, password} = data;
    if (password !== functions.config().admin.password){
        return res.status(401).send("Need password");
    }
    const result = await texttoSpeech(message, "text")
    const link = await uploadSound(result.audioContent,fileName+".mp3");
    return res.send(link)
}
