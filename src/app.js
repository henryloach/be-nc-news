const { handleCustomError, handleMissingPropertyError, handleValidationError, handleForeignKeyError, handleGenericError } = require("./errorHandlers.js")
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById, deleteCommentById, getUsers, getUserByName, patchCommentById, postArticle, postTopic, deleteArticleById, handleWildcardEndpoint } = require("./controllers.js")

const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
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

app.all("/api/*", handleWildcardEndpoint)

// Error handling 

app.use(handleCustomError)
app.use(handleValidationError)
app.use(handleMissingPropertyError)
app.use(handleForeignKeyError)
app.use(handleGenericError)

module.exports = app
