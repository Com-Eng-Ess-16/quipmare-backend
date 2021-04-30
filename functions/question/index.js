const express = require("express")
const router = express.Router()

const getQuestion = require("./getQuestion")
const postQuestion = require("./postQuestion");

router.post("/add", postQuestion);
router.get("/id/:id", getQuestion);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app