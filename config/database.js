const knex = require('knex');
const knexConfig = require('../knexfile');

// Use development configuration
const db = knex(knexConfig.development);

// Test connection
// db.raw('SELECT 1')
//   .then(() => {
//     console.log('Database connected successfully');
//   })
//   .catch((err) => {
//     console.error('Database connection failed:', err);
//   });

module.exports = db;