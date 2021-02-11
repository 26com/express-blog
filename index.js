const { app } = require('./server/config/express');

app.listen(4000, ()=>{
    console.log('--SERVER WAS STARTED--')
});