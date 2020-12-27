const articles = require('./articles');
const users = require('./users');
const { singIn } = require('../controllers/auth');

const express = require('express');
const router = express.Router();

//router.use('/', signIn);

router.use('/articles', articles.router);
router.use('/users', users.router);


module.exports = {
    router
};