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

const cors = require("cors");

app.use(urlEncodedParser);
app.use(json);

app.use(cookieParser(secretKey));

const hbs = require('hbs');
app.set('view engine', 'hbs');
app.use(Express.static(__dirname + '/../../public'));
hbs.registerPartials(__dirname + '/../../views/partials');

// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.append('Access-Control-Allow-Credentials', true);
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     res.status(200);
//     next();
// });

app.use(cors());

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