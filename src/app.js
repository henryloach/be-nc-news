const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById, deleteCommentById } = require("./controllers.js")

const express = require("express")
const app = express()

app.use(express.json())

// Endpoints 

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)

//

app.all("/api/*", (req, res) => {
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
    if (code === "23502") {
        res.status(400).send({ message: "Bad request: missing property"})
    }
    if (code === "23503") {
        res.status(404).send({ message: "User not found"})
    }
})

module.exports = app