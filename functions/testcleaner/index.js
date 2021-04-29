const express = require("express")
const router = express.Router()

const deleteRoom = require("./deleteRoom")
const deleteGame = require("./deleteGame")

router.get("/room", deleteRoom);
router.get("/game", deleteGame);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app