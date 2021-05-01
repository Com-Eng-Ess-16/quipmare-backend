const firebase = require("firebase-admin");
const fs = firebase.firestore();

module.exports = async (questions) => {
    const data = [];
    for (let i in Object.keys(questions)){
        const question = questions[i].questionPrompt;
        const a = questions[i].a.answer;
        const b = questions[i].b.answer;
        data.push({
            question,
            a,
            b
        })
    }
    const docRef = await fs.collection("archive").add({data});
    return docRef.id
}