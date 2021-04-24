const express = require("express")
const router = express.Router()

const deleteRoom = require("./deleteRoom")

router.get("/", deleteRoom);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app