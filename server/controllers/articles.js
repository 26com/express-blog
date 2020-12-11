const userId = 1;

const db = require('../models');
const { QueryTypes } = require('sequelize');

const getByUser = async function(req, res, next){

try{

    const articles = await db.sequelize.query(
        `SELECT * FROM articles WHERE "userId" = $userId ORDER BY Id DESC`, 
    {
        bind: {userId: userId},
        type: QueryTypes.SELECT
    });

    const userName = await db.sequelize.query(
        `SELECT name FROM users WHERE id = $userId`, 
        {
            bind: {userId: userId},
            type: QueryTypes.SELECT
        });

    function getNowDate(date){
        const nowDate = date.getDate();
        const nowMonth = Number(date.getMonth()) + 1;
        const nowYear = date.getFullYear();
        return nowDate + '/' + nowMonth + '/' + nowYear;
    };

    articles.forEach(elem => {
        elem.userName = userName[0].name;
        elem.date = getNowDate(elem.createdAt);
    });

    res.render('showArticles.hbs', {
        user_articles: articles
    });

}catch(err){
    console.log(err)
}

};

const createNew = async function(req, res, next){

    try{

    const response = await db.sequelize.query(
        `INSERT INTO articles (title, content, "userId", "createdAt")
        VALUES($title, $content, $userId, $date)`, 
    {
        bind: {
            title: req.body.title,
            content: req.body.content,
            userId: req.query.userId,
            date: new Date()
        },
        type: QueryTypes.SELECT
    });
    
    res.status(200).render('createForm.hbs');

    }catch(err){
        console.log(err);
    }

};

const showCreateForm = function(req, res, next){
    res.render('createForm.hbs', {
        userId: userId
    });
};

module.exports = {
    getByUser,
    createNew,
    showCreateForm
};