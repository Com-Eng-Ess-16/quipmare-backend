const express = require("express")
const router = express.Router()

const startGame = require("./startGame")

router.get("/start/:roomcode", startGame);
router.get("/:roomcode", startGame);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app