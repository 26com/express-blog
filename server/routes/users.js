const express = require('express');
const router = express.Router();

const { users } = require('../controllers');
const { auth } = require('../controllers');

router.post('/register', users.register);
router.get('/login', users.login, auth.getToken); 

module.exports = {
    router
};