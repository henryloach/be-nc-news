const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById, deleteCommentById, getUsers, getUserByName, patchCommentById, postArticle, postTopic, deleteArticleById } = require("./controllers.js")

const express = require("express")
const app = express()

app.use(express.json())

// Endpoints 

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)
app.post("/api/topics", postTopic)

app.get("/api/articles", getArticles)
app.post("/api/articles", postArticle)

app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)
app.delete("/api/articles/:article_id", deleteArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.get("/api/users", getUsers)
app.get("/api/users/:username", getUserByName)

app.patch("/api/comments/:comment_id", patchCommentById)
app.delete("/api/comments/:comment_id", deleteCommentById)

//

app.all("/api/*", (req, res) => {
    res.status(400).send({ message: "Bad endpoint" })
})

// Error handling 

app.use((err, req, res, next) => {
    const { status, message, code, detail } = err
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
        const errMap = {
            author: "User",
            topic: "Topic"
        }
        const column = detail.match(/\(.+?\)/)[0].slice(1,-1)
        res.status(404).send({ message: `${errMap[column]} not found`})
    }
})

module.exports = app