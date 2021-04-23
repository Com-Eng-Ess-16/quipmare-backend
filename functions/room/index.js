const express = require("express")
const router = express.Router()

const createRoom = require("./createRoom")

router.get("/create", createRoom);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app