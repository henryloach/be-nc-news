const db = require("../db/connection.js")

exports.selectTopics = () => {
    // console.log("fromModel")
    return db.query(`SELECT * FROM topics;`)
    .then( ({ rows }) => {
        // console.log(rows)
        return rows
    })
}