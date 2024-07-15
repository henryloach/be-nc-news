const { getTopics } = require("./controllers")

const express = require("express")
const app = express()

app.get("/api/topics", getTopics)

app.get("/api/*", (req, res) => {
    console.log("debug")
    res.status(404).send({ message: "Bad endpoint"})
})

module.exports = app