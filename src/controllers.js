const { selectTopics } = require("./models.js")
const endpoints = require("../endpoints.json")

exports.getEndpoints = (req, res) => {
    console.log(typeof endpoints)
    res.status(200).send({ endpoints })
}

exports.getTopics = (req, res) => {
    selectTopics()
        .then(topics => {
            res.status(200).send({ topics })
        })
}
