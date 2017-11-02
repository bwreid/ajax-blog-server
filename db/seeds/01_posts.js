
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        { id: 1, title: 'Hello World', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam ut sequi asperiores, itaque iste ea ad magnam! Eveniet vero sequi, incidunt molestiae. Excepturi sunt quod dicta dolorum ab. Pariatur, delectus?' }
      ]);
    }).then(() => {
      return knex.raw(`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));`)
    })
};
