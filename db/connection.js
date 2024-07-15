const { Pool, types } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

// Required to make node-pg parse COUNT() result as an int
const parseInteger = value => parseInt(value)
types.setTypeParser(20, parseInteger) 

module.exports = new Pool();
