const express = require('express');
const router = express.Router();

const { users } = require('../controllers');
const { auth } = require('../controllers');

router.post('/register', users.register);
router.get('/select', users.select);
router.post('/select', users.follow, users.select);
router.get('/login', users.login, auth.getToken); 

module.exports = {
    router
};