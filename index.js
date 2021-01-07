//dependencies import
const express = require('express');
const hbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 9090;

//secrets
require('dotenv').config();

//app settings
app.set('view engine', 'hbs');

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(port, () => {
    console.log('App listening at port ' + port);
});

//set static files
app.use(express.static(path.join(__dirname, 'public')));

//declare routes
const publicRoute = require('./routes/publicRoutes');

//use routes
app.use('/', publicRoute);

//database
const connection = require('./dbConfig');

connection.connect((err) => {
    console.log(err);

    console.log("database connected");
});