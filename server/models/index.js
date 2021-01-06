require('dotenv').config();

const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        define: {timestamps: false} 
    }
);

module.exports = {
    sequelize,
    Sequelize,
    DataTypes
};

require('./article');
require('./user');
require('./follower');

sequelize.sync()
.then(() => {
    console.log('--DB WAS CONNECTED--');
})
.catch(err => console.log(err));