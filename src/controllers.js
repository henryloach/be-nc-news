const { selectTopics, selectArticleById } = require("./models.js")
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