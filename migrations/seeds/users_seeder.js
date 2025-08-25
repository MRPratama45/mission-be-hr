exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password_123' // Dalam real app, gunakan bcrypt
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password_456'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'hashed_password_789'
    }
  ]);
  
  console.log('Users seed data inserted successfully');
};