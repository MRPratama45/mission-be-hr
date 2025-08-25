const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Inserts seed entries
  return knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};