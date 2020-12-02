const app = require('./server/config/express');

app.listen(3000, ()=>{
    console.log('--server was started--')
});