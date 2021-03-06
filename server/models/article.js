const {sequelize, DataTypes, Sequelize} = require('./index');

const Article = sequelize.define('article', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdat: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = {
    Article
};