const { selectTopics } = require("./models");

exports.getTopics = (req, res) => {
    // console.log("fromController")
    selectTopics()
        .then(topics => {
            // console.log(topics)
            res.status(200).send({ topics })
        })
}
