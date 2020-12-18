const {articles} = require('../controllers');

const express = require('express');
const router = express.Router();

//router.get('/create', articles.showCreateForm);
router.get('/:id', articles.getByUser);
router.post('/', articles.createNew);

module.exports = {
    router
};