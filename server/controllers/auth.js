const jwt = require('jsonwebtoken');
const { configs } = require('../config/config');

const getToken = function(req, res){

    try{

        const token = jwt.sign({
            id: req._userId,
            email: req.body.email
        }, configs.secretKey, {expiresIn: '1h'});

        res.cookie('token', token).status(200).json({
            massege: 'log in'
        });

    }catch(err){

        err.massage = 'Token not received.'

    }
};

const signIn = function(req, res, next){

    try{

        const token = req.cookies.token;
        
        if(token){
            jwt.verify(token, configs.secretKey, (err, decoded)=>{
                if(err){
                    console.log(err);
                    res.status(401).json({
                        massage: 'Wrong token. Please log in.'
                    });
                }
                else{
                    req._userId = decoded.id;
                    req._email = decoded.email;
                    next();
                }
            });
        }
        else{
            res.status(401).json({
                massage: 'Please log in.'
            });
        }

    }catch(err){

        err.massage = 'Login error.';
        next(err);

    }
};


module.exports = {
    getToken,
    signIn
};

