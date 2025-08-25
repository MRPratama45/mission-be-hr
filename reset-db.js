// File: reset-db.js
const mysql = require('mysql2/promise');

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  try {
    await connection.execute('DROP DATABASE IF EXISTS db_mission_be');
    await connection.execute('CREATE DATABASE db_mission_be');
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await connection.end();
  }
}

resetDatabase();


// ============= be-inter-2 ===========
// const mysql = require('mysql2/promise');

// async function resetDatabase() {
//   const connection = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: ''
//   });

//   try {
//     await connection.execute('DROP DATABASE IF EXISTS db_mission_be');
//     await connection.execute('CREATE DATABASE db_mission_be');
//     console.log('Database reset successfully');
//   } catch (error) {
//     console.error('Error resetting database:', error);
//   } finally {
//     await connection.end();
//   }
// }

// resetDatabase();