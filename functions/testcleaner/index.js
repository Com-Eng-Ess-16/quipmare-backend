const express = require("express")
const router = express.Router()

const deleteRoom = require("./deleteRoom")
const deleteGame = require("./deleteGame")
const uploadSound = require("./uploadSound")

router.get("/room", deleteRoom);
router.get("/game", deleteGame);
router.get("/upload", uploadSound);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app