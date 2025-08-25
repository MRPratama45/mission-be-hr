exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del();
  
  // Inserts seed entries
  await knex('products').insert([
    {
      name: 'Laptop Gaming',
      description: 'High performance gaming laptop',
      price: 12000000,
      stock: 15
    },
    {
      name: 'Smartphone',
      description: 'Latest smartphone with great camera',
      price: 5000000,
      stock: 30
    },
    {
      name: 'Headphones',
      description: 'Wireless noise-cancelling headphones',
      price: 1500000,
      stock: 50
    },
    {
      name: 'Smart Watch',
      description: 'Fitness and health tracking watch',
      price: 2500000,
      stock: 25
    },
    {
      name: 'Tablet',
      description: '10-inch tablet for work and entertainment',
      price: 3500000,
      stock: 20
    }
  ]);
  
  console.log('Products seed data inserted successfully');
};