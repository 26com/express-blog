const {articles} = require('../controllers');

const express = require('express');
const router = express.Router();

router.get('/', articles.getByUser);
router.post('/', articles.createNew);

module.exports = {
    router
};