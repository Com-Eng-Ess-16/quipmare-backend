const firebase = require("firebase-admin");
const fs = firebase.firestore();

module.exports = async (req,res)=>{
    const id = req.params.id;
    const questionRef = fs.collection('questions').doc(id);
    const doc = await questionRef.get();
    if (doc.exists){
        console.log(doc.data());
        return res.json(doc.data());
    }
    return res.status(404).send("No question found");
}