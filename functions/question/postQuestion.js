const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const fs = firebase.firestore();

module.exports = async (req,res)=>{
    const data = req.body
    let {question, password} = data;
    if (functions.config().admin.password === password){
        if(!question){
            return res.status(404).send("No question found");
        }
        const configRef = fs.collection('questions').doc("config")
        const config = await configRef.get();
        const id = config.data().last + 1;
        const questionRef = fs.collection('questions').doc(id.toString());
        const doc = await questionRef.set({
            id,
            question
        });
        const doc1 = await configRef.set({
            last: id,
        },{merge: true})
        return res.status(201).send("Added Id: "+ id);
    }
    return res.status(401).send("Wrong password");
}