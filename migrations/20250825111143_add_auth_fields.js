// File ini mungkin tidak perlu jika sudah include semua field di create table
exports.up = function(knex) {
  return knex.schema
    .table('users', function(table) {
      // Field sudah ada di create table, jadi tidak perlu ditambah lagi
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('users', function(table) {
      // Tidak perlu melakukan apa-apa
    });
};