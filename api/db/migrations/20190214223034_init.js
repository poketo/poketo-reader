exports.up = knex => {
  return knex.schema
    .createTable('users', t => {
      t.uuid('id')
        .unique()
        .primary()
        .notNullable();
      t.string('email').notNullable();
      t.string('password');
      t.string('slug')
        .unique()
        .notNullable();
      t.timestamp('createdAt').defaultTo(knex.fn.now());
    })
    .createTable('bookmarks', t => {
      t.uuid('id')
        .unique()
        .primary()
        .notNullable();
      t.uuid('ownerId')
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE');
      t.string('seriesId').notNullable();
      t.string('seriesUrl').notNullable();
      t.unique(['seriesId', 'ownerId']);
      t.string('lastReadChapterId');
      t.timestamp('lastReadAt');
      t.string('linkToUrl');
      t.timestamp('createdAt').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('bookmarks').dropTableIfExists('users');
};
