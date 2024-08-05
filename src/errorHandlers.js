exports.handleCustomError = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    } else {
        next(err)
    }
}

exports.handleValidationError = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ message: "Bad endpoint" })
    } else {
        next(err)
    }
}

exports.handleMissingPropertyError = (err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ message: "Bad request: missing property" })
    } else {
        next(err)
    }
}

exports.handleForeignKeyError = (err, req, res, next) => {
    if (err.code === "23503") {
        const errMap = {
            author: "User",
            topic: "Topic"
        }
        const column = err.detail.match(/\((.*?)\)/)[1]
        res.status(404).send({ message: `${errMap[column]} not found` })
    } else {
        next(err)
    }
}

exports.handleGenericError = (err, req, res, next) => {
    res.status(500).send({ message: "Internal Server Error" })
}