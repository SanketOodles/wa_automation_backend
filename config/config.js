module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'oodles12345',
    database: process.env.DB_NAME || 'psql_wa',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,  // Add port for development
    dialect: 'postgres',
    schema: 'public',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,  // Add port here
    dialect: 'postgres',
    schema: 'public',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,  // Add port here
    dialect: 'postgres',
    schema: 'public',
  },
};
