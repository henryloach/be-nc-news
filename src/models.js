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

exports.selectArticleById = target_id => {
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

exports.selectCommentsByArticleId = target_id => {
    // TODO refactor based on tuesdays lecture at some point
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
        })
        .then(() => {
            return db.query(
                `SELECT * FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC;`,
                [target_id]
            )
        })
        .then(({ rows }) => {
            return rows
        })
}

exports.insertCommentByArticleId = (target_id, comment) => {
    const { username, body } = comment
    // TODO refactor based on tuesdays lecture at some point
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
        })
        .then(() => {
            return db.query(
                `INSERT INTO comments (
                    author,
                    body,
                    article_id
                )
                VALUES ( 
                    $1,
                    $2,
                    $3
                ) 
                RETURNING *;`,
                [username, body, target_id]
            )
        })
        .then(({ rows }) => {
            return rows[0]
        })
}