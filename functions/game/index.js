const express = require("express")
const router = express.Router()

const startGame = require("./startGame")
const getGameId = require("./getGameId")
const getPlayerQuestion = require("./getPlayerQuestion");
const answerQuestion = require("./answerQuestion");
const voteAnswer = require("./voteAnswer");

router.get("/start/:roomcode", startGame);
router.get("/player/:gameId/:playerId", getPlayerQuestion);
router.post("/answer/:gameId", answerQuestion);
router.post("/vote/:gameId", voteAnswer);
router.get("/id/:roomcode", getGameId);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app