const articles = require('./articles');
const users = require('./users');

const express = require('express');
const router = express.Router();

router.use('/articles', articles.router);
router.use('/users', users.router);

module.exports = {
    router
};