const { Sequelize } = require('sequelize');

try {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect: 'postgres'
    });
    (async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    })();
} catch (err) {
    console.log(err);
}
