/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del();
  
  // Inserts seed entries
  return knex('products').insert([
    {
      name: 'Laptop Gaming',
      description: 'High performance gaming laptop',
      price: 15000000,
      stock: 10,
      image: 'laptop-gaming.jpg',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Smartphone',
      description: 'Latest smartphone with great camera',
      price: 5000000,
      stock: 25,
      image: 'smartphone.jpg',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Headphones',
      description: 'Wireless noise-cancelling headphones',
      price: 2000000,
      stock: 30,
      image: 'headphones.jpg',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};