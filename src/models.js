const db = require("../db/connection.js")
const format = require("pg-format")
const { getEndpointQueryData, getGreenlistMap, selectRowFromTable } = require("./model.ulits.js")


exports.selectTopics = () => {
    return db
        .query(
            `SELECT * FROM topics;`
        )
        .then(({ rows }) => {
            return rows
        })
}

exports.insertTopic = topic => {
    const { slug, description } = topic
    return db
        .query(
            `INSERT INTO topics (
                slug,
                description
            )
            VALUES (
                $1,
                $2  
            )
            RETURNING *;`,
            [slug, description]
        )
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.selectArticles = query => {
    const {
        sort_by = 'created_at',
        order = 'desc',
        topic = '%',
        author = '%',
        p: offset = 0,
        limit = 10
    } = query
    const queryParams = { sort_by, order, topic }

    const endpointQueryData = getEndpointQueryData("GET /api/articles")
    const allowedFields = endpointQueryData.map(query => query.field)
    const greenlistMap = getGreenlistMap(endpointQueryData)

    // check fields
    for (const field in query) {
        if (!allowedFields.includes(field)) {
            return Promise.reject({
                status: 400,
                message: "Bad request: invalid query field"
            })
        }
    }

    // check values
    for (const field in greenlistMap) {
        if (!greenlistMap[field].includes(queryParams[field])) {
            return Promise.reject({
                status: 400,
                message: `Bad request: invalid ${field} value`
            })
        }
    }

    if (limit && Number.isNaN(parseInt(limit))) {
        return Promise.reject({
            status: 400,
            message: "Bad request: 'limit' value must be a number"
        })
    }

    if (offset && Number.isNaN(parseInt(offset))) {
        return Promise.reject({
            status: 400,
            message: "Bad request: 'p' value must be a number"
        })
    }

    const totalString = format(
        `SELECT 
                    count(article_id) 
                FROM 
                    articles 
                WHERE 
                    topic LIKE %L;`,
        topic
    )

    const queryString = format(
        `SELECT 
            articles.article_id,
            articles.title,
            articles.topic,
            articles.author,
            articles.created_at,
            articles.votes,                                
            articles.article_img_url,
            COUNT(comment_id) AS comment_count
        FROM 
            articles 
        LEFT JOIN 
            comments ON articles.article_id = comments.article_id
        WHERE 
            articles.topic LIKE %L
        AND
            articles.author LIKE %L
        GROUP BY 
            articles.article_id
        ORDER BY
            %s %s
        LIMIT %s
        OFFSET %s;`,
        topic,
        author,
        sort_by === 'comment_count' ? 'comment_count' : `articles.${sort_by}`,
        order,
        limit,
        offset
    )

    return Promise.all([db.query(queryString), db.query(totalString)])
        .then(([{ rows: articles }, { rows: total }]) => {
            return { articles, total_count: total[0].count }
        })
}

exports.insertArticle = article => {
    const { author, title, body, topic } = article

    return db
        .query(
            `INSERT INTO articles (
                author,
                title,
                body,
                topic
            )
            VALUES ( 
                $1,
                $2,
                $3,
                $4
            ) 
            RETURNING *;`,
            [author, title, body, topic]
        )
        .then(({ rows }) => {
            rows[0].comment_count = 0
            return rows[0]
        })
}

exports.selectArticleById = target_id => {
    return db
        .query(
            `SELECT 
                    articles.article_id,
                    articles.title,
                    articles.topic,
                    articles.author,
                    articles.body,
                    articles.created_at,
                    articles.votes,
                    articles.article_img_url,
                    COUNT(comment_id) AS comment_count
                FROM 
                    articles LEFT JOIN comments
                ON 
                    articles.article_id = comments.article_id
                WHERE 
                    articles.article_id = $1
                GROUP BY 
                    articles.article_id;`,
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

exports.updateArticleById = (target_id, { inc_votes }) => {

    if (inc_votes && Number.isNaN(parseInt(inc_votes))) {
        return Promise.reject({
            status: 400,
            message: "Bad request: 'inc_votes' value must be a number"
        })
    }

    return selectRowFromTable(target_id, 'articles')
        .then(() => {
            return db
                .query(
                    `UPDATE articles
                    SET votes = votes + $1
                    WHERE article_id = $2
                    RETURNING *;`,
                    [inc_votes, target_id]
                )
        })
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.deleteArticleRowById = target_id => {
    return selectRowFromTable(target_id, 'articles')
        .then(() => {
            return db.query(
                `DELETE FROM articles
                WHERE article_id = $1;`,
                [target_id]
            )
        })
}

exports.selectCommentsByArticleId = (target_id, query) => {
    const {
        p: offset = 0,
        limit = 10
    } = query

    const endpointQueryData = getEndpointQueryData("GET /api/articles/:article_id/comments")
    const allowedFields = endpointQueryData.map(query => query.field)

    // check fields
    for (const field in query) {
        if (!allowedFields.includes(field)) {
            return Promise.reject({
                status: 400,
                message: "Bad request: invalid query field"
            })
        }
    }

    if (limit && Number.isNaN(parseInt(limit))) {
        return Promise.reject({
            status: 400,
            message: "Bad request: 'limit' value must be a number"
        })
    }

    if (offset && Number.isNaN(parseInt(offset))) {
        return Promise.reject({
            status: 400,
            message: "Bad request: 'p' value must be a number"
        })
    }

    return selectRowFromTable(target_id, 'articles')
        .then(() => {
            const totalString = format(
                `SELECT 
                    count(comment_id) 
                FROM 
                    comments
                WHERE 
                    article_id = %L;`,
                target_id
            )

            const queryString = format(
                `SELECT * FROM comments
                WHERE 
                    article_id = %L
                ORDER BY 
                    created_at DESC
                LIMIT %s
                OFFSET %s;`,
                target_id,
                limit,
                offset
            )

            return Promise.all([db.query(queryString), db.query(totalString)])
        })
        .then(([{ rows: comments }, { rows: total }]) => {
            return { comments, total_count: total[0].count }
        })
}

exports.insertCommentByArticleId = (target_id, comment) => {
    const { username, body } = comment

    return selectRowFromTable(target_id, 'articles')
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

exports.selectUsers = () => {
    return db
        .query(
            `SELECT * FROM users`
        )
        .then(({ rows }) => {
            return rows
        })
}

exports.selectUserByName = target_name => {
    return db
        .query(
            `SELECT * FROM users
            WHERE username = $1`,
            [target_name]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    message: "No user matching requested username"
                })
            }
            return rows[0]
        })
}

exports.updateCommentById = (target_id, { inc_votes }) => {
    if (inc_votes && Number.isNaN(parseInt(inc_votes))) {
        return Promise.reject({
            status: 400,
            message: "Bad request: 'inc_votes' value must be a number"
        })
    }
    return selectRowFromTable(target_id, 'comments')
        .then(() => {
            return db
                .query(
                    `UPDATE comments
                    SET votes = votes + $1
                    WHERE comment_id = $2
                    RETURNING *;`,
                    [inc_votes, target_id]
                )
        })
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.deleteCommentRowById = target_id => {
    return selectRowFromTable(target_id, 'comments')
        .then(() => {
            return db.query(
                `DELETE FROM comments
                WHERE comment_id = $1;`,
                [target_id]
            )
        })
}