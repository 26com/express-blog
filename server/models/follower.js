const { sequelize, Sequelize } = require('./index');
const { User } = require('./user');

const Follower = sequelize.define('follower', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    followerid: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// User.belongsToMany(User, {through: Follower});

module.exports = {
    Follower
};