const { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId } = require("./models.js")
const endpoints = require("../endpoints.json")
const { articleData } = require("../db/data/test-data/index.js")

exports.getEndpoints = (req, res) => {
    res.status(200).send({ endpoints })
}

exports.getTopics = (req, res) => {
    selectTopics()
        .then(topics => {
            res.status(200).send({ topics })
        })
        .catch(err => {
            console.log("err:", err)
        })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then(articles => {
            res.status(200).send({ articles })
        })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
        .then(article => {
            res.status(200).send({ article })
        })
        .catch(err => {
            next(err)
        })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id)
        .then(comments => {
            res.status(200).send({ comments })
        })
        .catch(err => {
            next(err)
        })
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    insertCommentByArticleId(article_id, req.body)
        .then(newComment => {
            res.status(201).send({ newComment })
        })
        .catch(err => {
            // console.log(err)
            next(err)
        })
}