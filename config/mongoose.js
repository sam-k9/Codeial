const mongoose = require('mongoose');
const env = require('./environment');

//connect to database
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);

//acquire the conection(to check if its sucesful)
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console, 'error connecting to db'));

//up and running then print the message
db.once('open', function(){
    console.log('Succesfully connecteed to the databse');
});