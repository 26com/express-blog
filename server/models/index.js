require('dotenv').config();

console.log(process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD);

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        define: {timestamp: true} 
    }
);

module.exports = {
    sequelize,
    Sequelize
};

require('./article');
require('./user');

sequelize.sync().then(() => console.log('---- ok sync ----')).catch(err => console.log(err));