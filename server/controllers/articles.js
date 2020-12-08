const userId = 1;

const db = require('../models');
const { QueryTypes } = require('sequelize');
const { Sequelize } = require('../models');

const getByUser = async function(req, res, next){

    const response = await db.sequelize.query(`SELECT * FROM articles WHERE UserId = $userId ORDER BY Id DESC`, 
    {
        bind: {userId: req.params['id']},
        type: QueryTypes.SELECT
    });

    res.status(200).send(response);

};

const createNew = async function(req, res, next){

    try{

    console.log('---- controller createNew ----');

    const response = await db.sequelize.query(
        `INSERT INTO articles (title, content, "userId")
        VALUES($title, $content, $userId)`, 
    {
        bind: {
            title: req.body.title,
            content: req.body.content,
            userId: userId
        },
        type: QueryTypes.SELECT
    });
    
    res.status(200).send(response);

    }catch(err){
        console.log(err);
    }

};

const showCreateForm = function(req, res, next){
    res.render('createForm.hbs');
}

module.exports = {
    getByUser,
    createNew,
    showCreateForm
};