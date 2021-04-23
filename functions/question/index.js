const express = require("express")
const router = express.Router()

const getQuestion = require("./getQuestion")

router.get("/:id", getQuestion);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app