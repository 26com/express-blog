const {app} = require('./server/config/express');
const {sequelize} = require('./server/models');

// app.listen(3000, ()=>{
//     console.log('--server was started--')
// });

sequelize.sync()
.then(() => {
    app.listen(3000);
    console.log('--THE SERVER WAS STARTED--');
})
.catch(err => console.log(err));