const {articles} = require('../controllers');

const express = require('express');
const router = express.Router();

router.get('/', articles.showCreateForm);
router.post('/', articles.createNew);
router.use('/:id', articles.getByUser);

module.exports = {
    router
};