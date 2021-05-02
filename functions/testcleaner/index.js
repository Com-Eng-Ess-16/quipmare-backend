const express = require("express")
const router = express.Router()

const deleteRoom = require("./deleteRoom")
const deleteGame = require("./deleteGame")
const uploadSound = require("./uploadSound")
const texttoSpeech = require("./texttoSpeech")

router.get("/room", deleteRoom);
router.get("/game", deleteGame);
router.get("/upload", uploadSound);
router.post("/tts", texttoSpeech);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app