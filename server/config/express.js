const Express = require('express');
const app = Express();

const {router} = require('../routes');

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});

const hbs = require('hbs');
app.set('view engine', 'hbs');
app.use(Express.static(__dirname + '/../../public'));
hbs.registerPartials(__dirname + '/../../views/partials');

app.use(urlEncodedParser);

app.use(router);

module.exports = {
    app
};