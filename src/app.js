const { getTopics, getEndpoints, getArticleById } = require("./controllers.js")

const express = require("express")
const app = express()

// Endpoints 

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/*", (req, res) => {
    res.status(400).send({ message: "Bad endpoint" })
})

// Error handling 

app.use((err, req, res, next) => {
    const { status, message, code } = err
    if (status && message) {
        res.status(status).send({ message })
    }
    if (code === "22P02") {
        res.status(400).send({ message: "Bad endpoint" })
    }
})

module.exports = app