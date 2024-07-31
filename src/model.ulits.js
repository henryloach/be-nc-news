const endpointsData = require("../endpoints.json")
const db = require("../db/connection.js")

exports.getEndpointQueryData = endpoint => {
    return endpointsData[endpoint].queries
}

exports.getGreenlistMap = queryData => {
    const resultObj = {}
    for (const query of queryData) {
        if ('greenlist' in query) {
            resultObj[query.field] = query.greenlist
        }
    }
    return resultObj
}

// maybe call this isRowInTable again, I don't think I use its resove value ever
exports.selectRowFromTable = (target_id, table) => {
    const row = table.slice(0, -1)
    return db
        .query(
            `SELECT * FROM ${table}
            WHERE ${row}_id = $1;`,
            [target_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    message: `No ${row} matching requested id`
                })
            } else {
                return rows[0]
            }
        })
}