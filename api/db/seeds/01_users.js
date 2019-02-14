exports.seed = knex => {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: '12e63540-9a2e-4a39-9560-87fc82ea1c6c',
          email: 'hello@poketo.app',
        },
        {
          id: '29718b22-f0f9-403f-ba4e-fb904d875d94',
          email: 'hello@example.com',
        },
      ]);
    });
};
