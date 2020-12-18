const db = require('../models');
const { QueryTypes } = require('sequelize');

const getByUser = async function(req, res, next){

try{

    const articles = await db.sequelize.query(
        `SELECT * FROM articles WHERE "userId" = $userId ORDER BY Id DESC`, 
    {
        bind: {userId: req.params.id},
        type: QueryTypes.SELECT
    });

    const userName = await db.sequelize.query(
        `SELECT name FROM users WHERE id = $userId`, 
        {
            bind: {userId: req.params.id},
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

    // res.status(200).render('showArticles.hbs', {
    //     user_articles: articles
    // });
    res.status(200).json({
        articles: articles 
    });

}catch(err){
    console.log(err)
}

};

const createNew = async function(req, res, next){

    try{

    await db.sequelize.query(
        `INSERT INTO articles (title, content, "userId", "createdAt")
        VALUES($title, $content, $userId, $date)`, 
    {
        bind: {
            title: req.body.title,
            content: req.body.content,
            userId: req.body.userId,
            date: new Date()
        },
        type: QueryTypes.INSERT
    });
    
    // res.status(201).render('createForm.hbs');
    res.status(201).json({
        massage: `Article ${req.body.title} was added`
    });

    }catch(err){
        console.log(err);
    }

};

// const showCreateForm = function(req, res, next){
//     res.status(200).render('createForm.hbs', {
//         userId: userId
//     });
// };

module.exports = {
    getByUser,
    createNew
    // showCreateForm
};