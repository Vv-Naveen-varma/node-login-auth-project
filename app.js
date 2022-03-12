const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Parse application/json
app.use(bodyParser.json());

// Templates-engine
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

// setting routers
const routes = require('./routers/user');
app.use(routes);

app.listen(port, ()=>console.log(`Server runing on port ${port}`))
