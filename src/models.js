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

exports.selectArticles = () => {
    return db
        .query(
            `SELECT 
                articles.article_id,
                title,
                topic,
                articles.author,
                articles.created_at,
                articles.votes,
                COUNT(comment_id) AS comment_count
            FROM 
                articles LEFT JOIN comments
            ON 
                articles.article_id = comments.article_id
            GROUP BY 
                articles.article_id
            ORDER BY
                articles.created_at DESC;`
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