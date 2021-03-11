const { QueryTypes } = require('sequelize');

const db = require('../models');
const { User } = require("../models/user");
const { Follower } = require("../models/follower");
const { Article } = require('../models/article');

const getByUser = async function(req, res, next){

    try{

        // const articles = await db.sequelize.query(
        //     `SELECT articles.id, articles.title, articles.content, articles.createdat, users.name 
        //     FROM articles 
        //     LEFT JOIN followers on followers.followerid = $userId
        //     AND articles.userid = followers.userid
        //     JOIN users on articles.userid = users.id
        //     where (followers.id != 0 or articles.userid = $userId)
        //     ORDER BY articles.createdat DESC`, 
        // {
        //     bind: {userId: req._userId},
        //     type: QueryTypes.SELECT
        // });
        
        function getNowDate(date){
            const nowDate = date.getDate();
            const nowMonth = Number(date.getMonth()) + 1;
            const nowYear = date.getFullYear();
            return nowDate + '/' + nowMonth + '/' + nowYear;
        };

        const user = await User.findOne({where: {id: req._userId}});
        const articles = await user.getArticles();

        articles.forEach(article => {
            article.dataValues.date = getNowDate(article.dataValues.createdat);
            article.dataValues.name = user.dataValues.name;
        });

        const followers = await Follower.findAll({where: {followerid: req._userId}});
        
        for(const follower of followers){
            const user = await User.findOne({where: {id: follower.dataValues.userid}});
            const userArticles = await user.getArticles();
            if(userArticles.length){
                for(const article of userArticles){
                    article.dataValues.date = getNowDate(article.dataValues.createdat);
                    article.dataValues.name = user.dataValues.name;
                    articles.push(article);
                }
            }
        };

        res.status(200).json({
            articles 
        });

    }
    catch(err){
        err.message = 'Articles were not uploaded';
        next(err);
    }
};

const createNew = async function(req, res, next){

    try{

        await db.sequelize.query(
            `INSERT INTO articles (title, content, userid, createdat)
            VALUES($title, $content, $userId, $date)`, 
        {
            bind: {
                title: req.body.title,
                content: req.body.content,
                userId: req._userId,
                date: new Date()
            },
            type: QueryTypes.INSERT
        });
        
        // res.status(201).render('createForm.hbs');
        res.status(201).json({
            message: `Article ${req.body.title} was added`
        });

    }catch(err){
        err.message = 'Article were not created';
        next(err);
    }

};

module.exports = {
    getByUser,
    createNew
};