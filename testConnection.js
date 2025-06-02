const { Sequelize } = require('sequelize');

// Set up Sequelize instance with your database credentials
const sequelize = new Sequelize('wa_automation', 'postgres', 'adarshpandey02', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();