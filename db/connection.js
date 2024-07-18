const { Pool, types } = require('pg')
const ENV = process.env.NODE_ENV || 'development'

console.log(ENV)

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
})

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set')
}

const config = {};

if (ENV === 'production') {
  console.log("debug");
  config.connectionString = process.env.DATABASE_URL
  config.max = 2
}

// Required to make node-pg parse COUNT() result as an int
const parseInteger = value => parseInt(value)
types.setTypeParser(20, parseInteger) 

module.exports = new Pool(config)
