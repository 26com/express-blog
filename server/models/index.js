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

const { User } = require("./user");
const { Article } = require("./article");
const { Follower } = require("./follower");

User.hasMany(Article, {onDelete: "cascade"});
Article.belongsTo(User);

User.hasMany(Follower, {onDelete: "cascade"});
Follower.belongsTo(User);

sequelize.sync()
.then(() => {
    console.log('--DB WAS CONNECTED--');
})
.catch(err => console.log(err));