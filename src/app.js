const { getTopics, getEndpoints } = require("./controllers.js")

const express = require("express")
const app = express()

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/*", (req, res) => {
    res.status(404).send({ message: "Bad endpoint"})
})

module.exports = app