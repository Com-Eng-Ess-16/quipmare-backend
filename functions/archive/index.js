const express = require("express")
const router = express.Router()

const getArchive = require("./getArchive")

router.get("/id/:archiveId", getArchive);

const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app