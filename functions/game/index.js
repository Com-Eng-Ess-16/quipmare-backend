const express = require("express")
const router = express.Router()

const startGame = require("./startGame")
const getGameId = require("./getGameId")

router.get("/start/:roomcode", startGame);
router.get("/:roomcode", getGameId);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app