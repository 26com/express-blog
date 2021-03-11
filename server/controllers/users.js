const db = require('../models');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const register = async function(req, res, next){

    try{
        const candidateEmail = await db.sequelize.query(
            `SELECT email FROM users WHERE email = $email`, {
            bind: { 
                email: req.body.email
            },
            type: QueryTypes.SELECT
        });

        const candidateName = await db.sequelize.query(
            `SELECT name FROM users WHERE name = $name`, {
            bind: {
                name: req.body.name
            },
            type: QueryTypes.SELECT
        });

        if(candidateName.length){
            //name is busy
            res.status(409).json({
                message: 'Name is busy'
            });
        }
        else if(candidateEmail.length){
            //email is busy
            res.status(409).json({
                message: 'Email is busy'
            });
        }
        else{

            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.password, salt);

            //register new
            const user = await db.sequelize.query(
                `INSERT INTO users (name, email, password)
                VALUES ($name, $email, $password)`
            , {
                bind: {
                    name: req.body.name,
                    email: req.body.email,
                    password: password
                },
                type: QueryTypes.INSERT
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

        const candidate = await db.sequelize.query(
            `SELECT * FROM users WHERE email = $email`
        ,{
            bind: {
                email: req._email
            },
            type: QueryTypes.SELECT
        });

        if(!!candidate.length){

            if(!req._check_token){
                const passwordResult = bcrypt.compareSync(req.query.password, candidate[0].password);
                if(passwordResult){
                    req._userId = candidate[0].id;
                    next();
                    return;
                };
            };

            if(req._check_token){

                req._userId = candidate[0].id;
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

        const users = await db.sequelize.query(`
            SELECT users.id, users.name, followers.userid, followers.followerid
            FROM users LEFT JOIN followers
            ON users.id = followers.userid AND followers.followerid = $userId 
            WHERE users.id != $userId
            AND users.name LIKE $inputValue
            ORDER BY name
        `,{
            bind: {
                userId: req._userId,
                inputValue
            },
            type: QueryTypes.SELECT
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


        await db.sequelize.query(`
            INSERT INTO followers (followerid, userid)
            VALUES ($followerId, $userId)
        `, {
            bind: {
                followerId: req._userId,
                userId: req.body.followerId
            },
            type: QueryTypes.INSERT
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


        await db.sequelize.query(`
            DELETE FROM followers
            WHERE followerid = $followerId
            AND userid = $userId
        `, {
            bind: {
                followerId: req._userId,
                userId: req.body.followerId
            },
            type: QueryTypes.DELETE
        });

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