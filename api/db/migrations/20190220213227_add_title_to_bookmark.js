exports.up = knex => {
  return knex.schema.table('bookmarks', t => {
    t.string('title');
  });
};

exports.down = knex => {
  return knex.schema.table('bookmarks', t => {
    t.dropColumns('title');
  });
};
