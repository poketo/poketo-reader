exports.up = knex => {
  return knex.schema
    .createTable('users', table => {
      table
        .uuid('id')
        .unique()
        .primary()
        .notNullable();
      table.string('email').notNullable();
      table.timestamps(true, true);
    })
    .createTable('collections', table => {
      table
        .uuid('id')
        .unique()
        .primary()
        .notNullable();
      table
        .string('slug')
        .unique()
        .notNullable();
      table
        .uuid('owner')
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('bookmarks', table => {
      table
        .uuid('id')
        .unique()
        .primary()
        .notNullable();
      table
        .uuid('collection')
        .notNullable()
        .references('collections.id')
        .onDelete('CASCADE');
      table.string('series_pid').notNullable();
      table.string('series_url').notNullable();
      table.string('last_read_chapter_pid');
      table.string('link_to_url');
      table.timestamps(true, true);
    });
};

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('collections')
    .dropTableIfExists('bookmarks');
};
