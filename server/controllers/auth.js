const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');

const db = require('../models');
const { configs } = require('../config/config');

const getToken = async function(req, res){

    try{

        const token = jwt.sign({
            id: req._userId,
            email: req._email
        }, configs.secretKey, {expiresIn: '300h'});
        
        await db.sequelize.query(
            `UPDATE users
            SET token = $token
            WHERE id = $userId`,
            {
                bind: {
                    token,
                    userId: req._userId
                },
                type: QueryTypes.UPDATE
            }
        );

        res.status(200).json({
            token,
            massege: 'log in'
        });

    }catch(err){

        err.message = 'Token not received.'

    }
};

const signIn = function(req, res, next){

    try{

        const token = req.headers.authorization;
        
        if(token){
            jwt.verify(token, configs.secretKey, async (err, decoded)=>{

                const lastToken = await db.sequelize.query(
                    `SELECT token FROM users
                    WHERE id = $userId`,
                    {
                        bind: {
                            userId: decoded.id
                        },
                        type: QueryTypes.SELECT
                    }
                );

                const checkToken = token === lastToken[0].token;

                if(err || !checkToken){
                    console.log(err);
                    res.status(401).json({
                        message: 'Wrong token. Please log in.'
                    });
                }
                else{
                    req._userId = decoded.id;
                    req._email = decoded.email;
                    req._check_token = checkToken;
                    next();
                }
            });
        }
        else{
            res.status(401).json({
                message: 'Please log in.'
            });
        }

    }catch(err){

        err.message = 'Login error.';
        next(err);

    }
};


module.exports = {
    getToken,
    signIn
};

