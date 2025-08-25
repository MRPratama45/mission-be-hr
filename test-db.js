const db = require('./config/database');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Cek apakah db memiliki method yang benar
    console.log('DB methods available:', Object.keys(db));
    
    // Test 2: Cek koneksi
    const result = await db.raw('SELECT 1 + 1 as result');
    console.log('Connection test result:', result[0]);
    
    // Test 3: Cek apakah table exists
    const tables = await db.raw('SHOW TABLES');
    console.log('Tables in database:', tables[0]);
    
    // Test 4: Coba query sederhana
    const users = await db('users').select('*');
    console.log('Users count:', users.length);
    
  } catch (error) {
    console.error('Database test failed:', error);
  } 
}

testDatabase();