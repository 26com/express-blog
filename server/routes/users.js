const express = require('express');
const router = express.Router();

const Controllers = require('../controllers');

const users = router.get('/search', Controllers.users.getByName);

module.exports = {
    users
};