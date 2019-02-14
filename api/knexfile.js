require('now-env');

module.exports = {
  client: 'pg',
  connection: process.env.POSTGRES_URL,
  migrations: {
    directory: 'db/migrations',
    tableName: 'migrations',
  },
  seeds: {
    directory: 'db/seeds',
  },
  pool: {
    min: 2,
    max: 10,
  },
};
