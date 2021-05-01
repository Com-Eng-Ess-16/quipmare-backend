const express = require("express")
const router = express.Router()

const startGame = require("./startGame")
const getGameId = require("./getGameId")
const getPlayerQuestion = require("./getPlayerQuestion");
const answerQuestion = require("./answerQuestion");
const voteAnswer = require("./voteAnswer");
const getVoteQuestion = require("./getVoteQuestion");
const nextState = require("./nextState");
const getScoreboard = require("./getScoreboard");

router.get("/start/:roomcode", startGame);
router.get("/player/:gameId/:playerId", getPlayerQuestion);
router.get("/question/:gameId/:questionIndex", getVoteQuestion);
router.post("/answer/:gameId", answerQuestion);
router.get("/next/:gameId", nextState);
router.post("/vote/:gameId", voteAnswer);
router.get("/id/:roomcode", getGameId);
router.get("/score/:gameId", getScoreboard);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app