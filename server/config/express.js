const Express = require('express');
const app = Express();

//routes
const {router} = require('../routes');

//body-parser
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const json = bodyParser.json();

//cookie
const cookieParser = require('cookie-parser');
const { secretKey } = require('./config');

app.use(urlEncodedParser);
app.use(json);

app.use(cookieParser(secretKey));

app.use(Express.static(__dirname + '/../../public'));
app.use(router);

//catch an error
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.log('Error:: ', err);
    res.json({
        massage: 'Error: ' + err.massage
    });
});

module.exports = {
    app
};