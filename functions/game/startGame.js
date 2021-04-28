const firebase = require("firebase-admin");
const db = firebase.database();

module.exports = async (req,res)=>{
    const roomcode = req.params.roomcode;
    const snapshot = await db.ref("/room/" + roomcode).get();
    if (snapshot.exists()){
        if (snapshot.val().roomState !== "playing"){
            const players = snapshot.val().players;
            if(Object.keys(players).length > 2){
                const gameID = roomcode+ "-" +randomString(10);
                const pairs = randomPlayerPair(Object.keys(players));
                const playerObject = getPlayerObject(Object.keys(players), pairs);
                const question = getQuestionObject(pairs);
                await db.ref("/game/" + gameID).set({
                    players: playerObject,
                    question
                })
                await db.ref("/room/" + roomcode).update({
                    gameID,
                    roomState: "playing",
                    updateTime: Date.now(),
                })
                return res.json({
                    gameID
                });
            } else {
                return res.status(401).send("Need more players");
            }
        } else {
            return res.status(403).send("Ingame progress");
        }
    }else{
        return res.status(404).send("Room not found");
    }
    
}

const randomString = (length) => {
    let ran = "";
    for (let i=0;i<length;i++){
        ran += String.fromCharCode(96 + Math.ceil(Math.random()*26));
    }
    return ran;
}

const randomPlayerPair = (players) => {
    const shuffledArray = players.sort((a, b) => 0.5 - Math.random());
    shuffledArray.push(shuffledArray[0]);
    const pairs = [];
    for (let i=0;i<players.length-1;i++){
        pairs.push([shuffledArray[i], shuffledArray[i+1]].sort((a, b) => 0.5 - Math.random()))
    }
    return pairs;
}

const getPlayerObject = (players, pairs) => {
    const playerQuestion = {};
    players.forEach(player => {
        playerQuestion[player] = {
        question:[],
        point: 0,
    };
    })
    pairs.forEach((pair,index) => {
        playerQuestion[pair[0]].question.push({
            answer: 0,
            question: index,
        })
        playerQuestion[pair[1]].question.push({
            answer: 1,
            question: index,
        })
    });
    return playerQuestion;
}

const getQuestionObject = (pairs) => {
    const questions = getQuestionsId(pairs);
    const question = {};
    pairs.forEach((pair,index) => {
        question[index] = {
            questionId: questions[index],
            a: {
                vote: 0,
                owner: pair[0],
                answer: "",
                voice: "",
            },
            b: {
                vote: 0,
                owner: pair[1],
                answer: "",
                voice: "",
            },
        }
    })
    return question;
}

const getQuestionsId = (pairs) => {
    const questions = new Set();
    const number = pairs.length;
    while (questions.size<number){
        questions.add(Math.floor(Math.random()*20));
    }
    return Array.from(questions);
}