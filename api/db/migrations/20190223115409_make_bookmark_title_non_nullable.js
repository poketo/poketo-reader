exports.up = knex => {
  return knex.schema.alterTable('bookmarks', t => {
    t.string('title')
      .notNullable()
      .alter();
  });
};

exports.down = knex => {
  return knex.schema.alterTable('bookmarks', t => {
    t.string('title')
      .nullable()
      .alter();
  });
};
