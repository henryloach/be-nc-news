const { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById, deleteCommentRowById, selectUsers, selectUserByName, updateCommentById, insertArticle, insertTopic, deleteArticleRowById } = require("./models.js")
const endpoints = require("../endpoints.json")

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({ endpoints })
}

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then(topics => {
            res.status(200).send({ topics })
        })
        .catch(err => {
            next(err)
        })
}

exports.postTopic = (req, res, next) => {
    insertTopic(req.body)
    .then(newTopic => {
        res.status(201).send({ newTopic })
    })
    .catch(err => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles(req.query)
        .then(({ articles, total_count }) => {
            res.status(200).send({ articles, total_count })
        })
        .catch(err => {
            next(err)
        })
}

exports.postArticle = (req, res, next) => {
    insertArticle(req.body)
        .then(newArticle => {
            res.status(201).send({ newArticle })
        })
        .catch(err => {
            next(err)
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

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    updateArticleById(article_id, req.body)
        .then(updatedArticle => {
            res.status(200).send({ updatedArticle })
        })
        .catch(err => {
            next(err)
        })
}

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params
    deleteArticleRowById(article_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            next(err)
        })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id, req.query)
        .then(({ comments, total_count }) => {
            res.status(200).send({ comments, total_count })
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
            next(err)
        })
}

exports.getUsers = (req, res, next) => {
    selectUsers()
        .then(users => {
            res.status(200).send({ users })
        })
        .catch(err => {
            next(err)
        })
}

exports.getUserByName = (req, res, next) => {
    const { username } = req.params
    selectUserByName(username)
        .then(user => {
            res.status(200).send({ user })
        })
        .catch(err => {
            next(err)
        })
}

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params
    updateCommentById(comment_id, req.body)
        .then(updatedComment => {
            res.status(200).send({ updatedComment })
        })
        .catch(err => {
            next(err)
        })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    deleteCommentRowById(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            next(err)
        })

}

exports.handleWildcardEndpoint = (req, res, next) => {
    const err = new Error("Bad endpoint")
    err.status = 400
    next(err)
}