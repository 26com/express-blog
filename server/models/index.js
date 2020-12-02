require('dotenv');
require('./article');
require('./user');

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