const db = require('../routes');

const getByName = async function(req, res, next){
    const user = await db.sequelize.query('SELECT * FROM users WHERE Name LIKE `${req.body.name}`');
};