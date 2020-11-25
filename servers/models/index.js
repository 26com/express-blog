const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'express-blog',
    'postgres',
    '159753',
    {
        dialect: 'postgres',
        define: {timestamp: true} 
    }
)