const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const addTime = require("../helper/addTime");
const calculateScore = require("../helper/calculateScore");
const convertDataToFirestore = require("../helper/convertDataToFirestore");
const nextState = require('../helper/nextState');
const db = firebase.database();

module.exports = async (req,res)=>{
    const gameid = req.params.gameId;
    const newState = await nextState(gameid);
    if (newState == 404){
        return res.status(404).send("Game not found");
    }else {
        return res.json({
            newState
        })
    }
}