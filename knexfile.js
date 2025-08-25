require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'db_mission_be'
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    },
    debug: true
  },
  
  // Tambahkan environment lainnya
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    }
  }
};





// ========= be-inter-2 =========
// require('dotenv').config();
// const path = require('path');

// module.exports = {
//   development: {
//     client: 'mysql2',
//     connection: {
//       host: 'localhost',
//       port: 3306,
//       user: 'root',
//       password: '',
//       database: 'db_mission_be'
//     },
//     migrations: {
//       directory: path.join(__dirname, 'migrations'),
//       tableName: 'knex_migrations'
//     },
//     seeds: {
//       directory: path.join(__dirname, 'seeds')
//     },
//     debug: true // Tambahkan untuk debug
//   }
// };