const {articles} = require('../controllers');

const express = require('express');
const router = express.Router();

router.use('/', articles.createNew);
router.use('/:id', articles.getByUser);

module.exports = {
    router
};