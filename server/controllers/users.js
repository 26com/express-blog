const db = require('../models');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { configs } = require('../config/config');

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
                massage: 'Name is busy'
            });
        }
        else if(candidateEmail.length){
            //email is busy
            res.status(409).json({
                massage: 'Email is busy'
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
                massage: 'User created'
            });
        }
    }
    catch(err){
        err.massage = 'User were not created';
        next(err);
    }
};

const login = async function(req, res, next){

    try{

        const candidate = await db.sequelize.query(
            `SELECT * FROM users WHERE email = $email`
        ,{
            bind: {
                email: req.body.email,
            },
            type: QueryTypes.SELECT
        });

        if(candidate.length){

            console.log(configs.secretKey);

            const passwordResult = bcrypt.compareSync(req.body.password, candidate[0].password);

            if(passwordResult){
                req._userId = candidate[0].id;
                next();
            }
            else{
                res.status(401).json({
                    massage: 'invalid password'
                });
            }
        }
            
        else{
            res.status(404).json({
                massage: 'user not found'
            });
        }
    }
    catch(err){
        err.massage = 'The user is not logged in.'
        next(err);
    }
};

const select = async function(req, res, next){

    try{

        const users = await db.sequelize.query(`
            SELECT * FROM users
        `,{
            type: QueryTypes.SELECT
        });

        res.status(200).render('selectUser.hbs',{
            users: users
        });

    }catch(err){

        err.massage = 'Users were not selected.'
        next(err);

    }

};


module.exports = {
    login,
    register,
    select
};