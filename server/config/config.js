require('dotenv').config();

const configs = {
    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    secretKey: process.env.SECRET_KEY
};

module.exports = {
    configs
}