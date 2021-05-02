const firebase = require("firebase-admin");
const fs = firebase.firestore();

module.exports = async (req, res) => {
    const archiveId = req.params.archiveId;
    const doc = await fs.collection("archive").doc(archiveId).get();
    if(doc.exists){
        return res.json(doc.data());
    }else{
        res.status(404).send("Archive not found")
    }
}