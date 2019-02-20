exports.up = knex => {
  return knex.schema.table('bookmarks', t => {
    t.string('seriesTitle'); // To be made non-nullable in a later migration.
  });
};

exports.down = knex => {
  return knex.schema.table('bookmarks', t => {
    t.dropColumns('seriesTitle');
  });
};
