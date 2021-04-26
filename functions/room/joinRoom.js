const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");
const colors = new Set([0,1,2,3,4,5,6,7]);

module.exports = async (req,res)=>{
    const code = req.params.roomcode;
    const data = req.body
    let {username, color, type} = data;
    const snapshot = await dbRef.child(code).get();
    const exist = snapshot.exists();
    const value = snapshot.val();
    let playerId = 8;
    const players = value["players"];
    if (exist){
        if (!!players){
            if (Object.keys(players).length >= 8 || type != "player"){
                const specId = randomString(8);
                dbRef.child(code).child("spectator").child(specId).set(specId)
                return res.json({
                    spectateId: specId,
                    type: "spectate"
                })
            }
            Object.keys(players).forEach( player => {
                colors.delete(players[player]["color"]);
            })
            color = pickedColor(color)
            for (let i=0;i<8;i++){
                if (!players[i]){
                    playerId = i;
                    const createSnap = await dbRef.child(code).child("players").child(i).set({
                        username,
                        color, 
                    })
                    break
                }
            }
        }else{
            playerId = 0;
            const createSnap = await dbRef.child(code).child("players").set({
                0: {
                    username,
                    color,
                }
            })
        }
        
    }
    return res.json({
        playerId,
        username,
        color,
        type: "player"
    });
}

const pickedColor = (color) => {
    if (colors.has(color)){
        return color
    }
    let ran = Math.floor(Math.random() * colors.size); 
    if (ran>=colors.size){
        ran -= 1;
    }
    console.log(Array.from(colors)[8])
    return Array.from(colors)[ran];
}

const randomString = (length) => {
    let ran = "";
    for (let i=0;i<length;i++){
        ran += String.fromCharCode(96 + Math.ceil(Math.random()*26));
    }
    return ran;
}