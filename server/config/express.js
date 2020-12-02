const Express = require('express');
const app = Express();

const router = require('../routes');

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});

const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(Express.static(__dirname + '/public'));

app.use(urlEncodedParser);

app.use(router);

