const db = require("../db/connection.js")

exports.selectTopics = () => {
    return db
        .query(
            `SELECT * FROM topics;`
        )
        .then(({ rows }) => {
            return rows
        })
}

exports.selectArticleById = (target_id) => {
    return db
        .query(
            `SELECT * FROM articles
            WHERE article_id = $1;`,
            [target_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    message: "No article matching requested id"
                })
            }
            return rows[0]
        })
}