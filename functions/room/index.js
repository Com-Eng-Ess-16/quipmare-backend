const express = require("express")
const router = express.Router()

const checkRoom = require("./checkRoom")
const createRoom = require("./createRoom")

router.get("/create", createRoom);
router.get("/check/:roomcode", checkRoom);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app