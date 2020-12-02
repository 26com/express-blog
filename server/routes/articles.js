const {articles} = require('../controllers');

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});

router.use('/', urlEncodedParser, articles.createNew);
router.use('/:id', articles.getByUser);

module.exports = {
    router
};