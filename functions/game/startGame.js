const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const addTime = require("../helper/addTime");
const db = firebase.database();
const fs = firebase.firestore();

module.exports = async (req,res)=>{
    const roomcode = req.params.roomcode;
    const snapshot = await db.ref("/room/" + roomcode).get();
    functions.logger.info("startGame " + roomcode);
    if (snapshot.exists()){
        if (snapshot.val().roomState !== "playing"){
            const players = snapshot.val().players;
            if(Object.keys(players).length > 2){
                const configRef = fs.collection('questions').doc("config")
                const config = await configRef.get();
                const numOfQuestion = config.data().last;
                const gameId = roomcode+ "-" +randomString(10);
                const pairs = randomPlayerPair(Object.keys(players));
                const playerObject = getPlayerObject(Object.keys(players), pairs);
                const questions = await getQuestionObject(pairs, numOfQuestion);
                await db.ref("/game/" + gameId).set({
                    players: playerObject,
                    questions,
                    gameState: "answer",
                    questionState: 0,
                    roundRemain: 1,
                    deadlineTime: addTime(75),
                })
                await db.ref("/room/" + roomcode).update({
                    gameId,
                    roomState: "playing",
                    updateTime: Date.now(),
                })
                functions.logger.info("Create game: " + gameId);
                return res.json({
                    gameId
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
        questions:[],
        point: 0,
    };
    })
    pairs.forEach((pair,index) => {
        playerQuestion[pair[0]].questions.push({
            answer: 'a',
            questionIndex: index,
        })
        playerQuestion[pair[1]].questions.push({
            answer: 'b',
            questionIndex: index,
        })
    });
    return playerQuestion;
}

const getQuestionObject = async (pairs, numOfQuestion) => {
    const questions = getQuestionsId(pairs, numOfQuestion);
    const question = {};
    for (let index=0; index<questions.length;index++){
        const pair = pairs[index];
        const questionRef = fs.collection('questions').doc(questions[index].toString());
        const doc = await questionRef.get();
        question[index] = {
            questionId: questions[index],
            questionPrompt: doc.data().question,
            a: {
                vote: [],
                owner: pair[0],
                answer: "",
            },
            b: {
                vote: [],
                owner: pair[1],
                answer: "",
            },
            voiceUrl: "",
        }
    };
    return question;
}

const getQuestionsId = (pairs, numOfQuestion) => {
    const questions = new Set();
    const number = pairs.length;
    while (questions.size<number){
        questions.add(Math.ceil(Math.random()*numOfQuestion));
    }
    return Array.from(questions);
}