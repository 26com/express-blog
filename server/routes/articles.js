const {articles} = require('../controllers');

const express = require('express');
const router = express.Router();

router.get('/create', articles.showCreateForm);
router.get('/search', articles.getByUser);
router.post('/create', articles.createNew);

module.exports = {
    router
};