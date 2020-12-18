const db = require('../models');
const {QueryTypes} = require('sequelize');
const bcrypt = require('bcryptjs');

const register = async function(req, res, next){

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
        res.status(401).json({
            massage: 'Name is busy'
        });
    }
    else if(candidateEmail.length){
        //email is busy
        res.status(401).json({
            massage: 'Email is busy'
        });
    }
    else{

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //register new
        try{
            const user = await db.sequelize.query(
                `INSERT INTO users (name, email, password)
                VALUES ($name, $email, $password)`
            , {
                bind: {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                },
                type: QueryTypes.INSERT
            });

            res.status(201).json({
                user: user,
                massage: 'User created'
            });
        }
        catch(err){
            console.log(err);
            res.status(501).json({
                massage: 'Server error. Try again later.'
            })
        }
    }
};

const login = async function(req, res){

    const candidate = await db.sequelize.query(
        `SELECT * FROM users WHERE email = $email`
    ,{
        bind: {
            email: req.body.email,
        },
        type: QueryTypes.SELECT
    });



    if(candidate.length){

        const passwordResult = bcrypt.compareSync(req.body.password, candidate[0].password)
        if(passwordResult){
            res.status(200).json({
                massage: 'login'
            });
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
};

module.exports = {
    login,
    register
};