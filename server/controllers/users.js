const { QueryTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const db = require('../models');
const { User } = require("../models/user");
const { Follower } = require("../models/follower");

const register = async function(req, res, next){

    try{
        // const candidateEmail = await db.sequelize.query(
        //     `SELECT email FROM users WHERE email = $email`, {
        //     bind: { 
        //         email: req.body.email
        //     },
        //     type: QueryTypes.SELECT
        // });

        const candidateEmail = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        // const candidateName = await db.sequelize.query(
        //     `SELECT name FROM users WHERE name = $name`, {
        //     bind: {
        //         name: req.body.name
        //     },
        //     type: QueryTypes.SELECT
        // });

        const candidateName = await User.findOne({
            where: {
                email: req.body.name
            }
        });

        if(candidateName){
            //name is busy
            res.status(409).json({
                message: 'Name is busy'
            });
        }
        else if(candidateEmail){
            //email is busy
            res.status(409).json({
                message: 'Email is busy'
            });
        }
        else{

            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.password, salt);

            //register new
            // const user = await db.sequelize.query(
            //     `INSERT INTO users (name, email, password)
            //     VALUES ($name, $email, $password)`
            // , {
            //     bind: {
            //         name: req.body.name,
            //         email: req.body.email,
            //         password: password
            //     },
            //     type: QueryTypes.INSERT
            // });

            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password
            });

            res.status(201).json({
                user: user,
                message: 'User created'
            });
        }
    }
    catch(err){
        err.message = 'User were not created';
        next(err);
    }
};

const login = async function(req, res, next){

    req._email = req.query.email ? req.query.email : req._email;

    try{

        // const candidate = await db.sequelize.query(
        //     `SELECT * FROM users WHERE email = $email`
        // ,{
        //     bind: {
        //         email: req._email
        //     },
        //     type: QueryTypes.SELECT
        // });

        const candidate = await User.findOne({
            where: {
                email: req._email
            }
        });

        if(candidate){

            if(!req._check_token){
                const passwordResult = bcrypt.compareSync(req.query.password, candidate.dataValues.password);
                if(passwordResult){
                    req._userId = candidate.dataValues.id;
                    next();
                    return;
                };
            };

            if(req._check_token){

                req._userId = candidate.dataValues.id;
                next();
                return;

            }
            else{
                res.status(401).json({
                    message: 'invalid password'
                });
            }
        }
            
        else{
            res.status(404).json({
                message: 'user not found'
            });
        }
    }
    catch(err){
        err.message = 'The user is not register.'
        next(err);
    }
};

const getUsersList = async function(req, res, next){

    const inputValue = "%" + req.query.inputValue + "%"

    try{

        // const users = await db.sequelize.query(`
        //     SELECT users.id, users.name, "userId", followers.followerid
        //     FROM users LEFT JOIN followers
        //     ON users.id = "userId" AND followers.followerid = $userId 
        //     WHERE users.id != $userId
        //     AND users.name LIKE $inputValue
        //     ORDER BY name
        // `,{
        //     bind: {
        //         userId: req._userId,
        //         inputValue
        //     },
        //     type: QueryTypes.SELECT
        // });

        const users = await User.findAll({
            where: {
                [Op.and]: [
                    {id: {[Op.ne]: req._userId}},
                    {name: {[Op.like]: inputValue}}
                ]
            },
            attributes: ["id", "name"],
            include: {
                model: Follower,
                attributes: ["followerid"],
                where: {
                    "$followers.followerid$": req._userId
                },
                required: false
            }
        });

        res.status(200).json({
            data: users
        });

    }catch(err){

        err.message = 'Users were not selected.'
        next(err);

    }

};

const subscribe = async function(req, res, next){

    console.log("RUN SUBSCRIBE");

    try{


        // await db.sequelize.query(`
        //     INSERT INTO followers (followerid, "userId")
        //     VALUES ($followerId, $userId)
        // `, {
        //     bind: {
        //         followerId: req._userId,
        //         userId: req.body.followerId
        //     },
        //     type: QueryTypes.INSERT
        // });

        await Follower.create({
            userId: req.body.followerId,
            followerid: req._userId
        });

        res.status(200).json({
            message: 'Follower was added.'
        });

    }catch(err){

        err.message = 'Follower were not added.'
        next(err);

    }

};

const unsubscribe = async function(req, res, next){

    try{


        // await db.sequelize.query(`
        //     DELETE FROM followers
        //     WHERE followerid = $followerId
        //     AND "userId" = $userId
        // `, {
        //     bind: {
        //         followerId: req._userId,
        //         userId: req.body.followerId
        //     },
        //     type: QueryTypes.DELETE
        // });

        await Follower.destroy({where: {
            [Op.and]: [
                {followerid: req._userId}, {userId: req.body.followerId}
            ]
        }});

        res.status(200).json({
            message: 'Follower was deleted.'
        });

    }catch(err){

        err.message = 'Follower were not added.'
        next(err);

    }

};


module.exports = {
    login,
    register,
    getUsersList,
    subscribe,
    unsubscribe
};