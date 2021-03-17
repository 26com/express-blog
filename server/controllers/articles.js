const { QueryTypes, Op } = require('sequelize');

const db = require('../models');
const { User } = require("../models/user");
const { Follower } = require("../models/follower");
const { Article } = require('../models/article');
const { formatArticlesDate } = require('../utils/formatArticlesDate');

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

        const result = await Article.findAll({
            where: {
                [Op.or]: [
                    {"$user.id$": req._userId},
                    {"$user.followers.followerid$": req._userId}
                ]
            },
            attributes: ["id", "title", "content", "createdat"],
            include: {
                model: User,
                attributes: ["name"],
                include: {
                    model: Follower,
                    attributes: [],
                    required: false
                }
            }
        });

        const articles = formatArticlesDate(result);

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

        // await db.sequelize.query(
        //     `INSERT INTO articles (title, content, userid, createdat)
        //     VALUES($title, $content, $userId, $date)`, 
        // {
        //     bind: {
        //         title: req.body.title,
        //         content: req.body.content,
        //         userId: req._userId,
        //         date: new Date()
        //     },
        //     type: QueryTypes.INSERT
        // });

        const article = await Article.create({
            title: req.body.title,
            content: req.body.content,
            userId: req._userId,
            createdat: new Date()
        });

        console.log(article);

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