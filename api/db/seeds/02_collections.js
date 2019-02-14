exports.seed = knex => {
  // Deletes ALL existing entries
  return knex('collections')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('collections').insert([
        {
          id: '5e8ac124-128a-46c4-a592-49ad03fd2b93',
          slug: 'a4vhAoFG',
          owner: '12e63540-9a2e-4a39-9560-87fc82ea1c6c',
        },
        {
          id: '8e989064-8bb9-4933-925e-ab8d9375ade4',
          slug: 'HJ0hABZcz',
          owner: '29718b22-f0f9-403f-ba4e-fb904d875d94',
        },
      ]);
    });
};
