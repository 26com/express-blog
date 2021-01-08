const express = require('express');
const router = express.Router();

const { users } = require('../controllers');
const { auth } = require('../controllers');

router.post('/register', users.register);
router.get('/subscribe', users.getUsersList);
router.post('/subscribe', users.subscribe);
router.post('/unsubscribe', users.unsubscribe);
router.get('/login', users.login, auth.getToken); 

module.exports = {
    router
};