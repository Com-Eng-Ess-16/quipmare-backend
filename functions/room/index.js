const express = require("express")
const router = express.Router()

const checkRoom = require("./checkRoom")
const joinRoom = require("./joinRoom")
const createRoom = require("./createRoom")
const kickPlayer = require("./kickPlayer")
const returnLobby = require("./returnLobby")

router.get("/create", createRoom);
router.post("/join/:roomcode", joinRoom);
router.delete("/kick/:roomcode", kickPlayer);
router.get("/check/:roomcode", checkRoom);
router.get("/return/:roomcode", returnLobby);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app