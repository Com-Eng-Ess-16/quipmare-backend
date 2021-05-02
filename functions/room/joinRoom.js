const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const dbRef = firebase.database().ref("/room");

module.exports = async (req,res)=>{
    const colors = new Set([0,1,2,3,4,5,6,7]);
    const code = req.params.roomcode;
    const data = req.body
    let {username, color, type, deviceId} = data;
    functions.logger.debug("joinRoom ", code, username);
    const snapshot = await dbRef.child(code).get();
    const exist = snapshot.exists();
    let playerId = 8;
    try {
        if (exist){
            const value = snapshot.val();
            const players = value["players"];
            if (!!players){
                if (Object.keys(players).length >= 8 || type !== "player" || value.roomState !== "waiting"){
                    const specId = randomString(8);
                    await dbRef.child(code).child("spectator").child(specId).set(deviceId);
                    return res.json({
                        spectateId: specId,
                        type: "spectate"
                    })
                }
                Object.keys(players).forEach( player => {
                    colors.delete(players[player]["color"]);
                })
                color = pickedColor(color, colors);
                for (let i=0;i<8;i++){
                    if (!players[i]){
                        playerId = i;
                        const createSnap = await dbRef.child(code).child("players").child(i).set({
                            username,
                            color, 
                            deviceId,
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
                        deviceId,
                    }
                })
            }
            return res.json({
                playerId,
                username,
                color,
                type: "player"
            });
        } else{
            res.status(404).send("Room not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const pickedColor = (color, colors) => {
    if (colors.has(color)){
        return color
    }
    let ran = Math.floor(Math.random() * colors.size); 
    if (ran>=colors.size){
        ran -= 1;
    }
    return Array.from(colors)[ran];
}

const randomString = (length) => {
    let ran = "";
    for (let i=0;i<length;i++){
        ran += String.fromCharCode(96 + Math.ceil(Math.random()*26));
    }
    return ran;
}