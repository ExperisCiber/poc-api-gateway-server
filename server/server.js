var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var app = express();

var apiV1 = require('./apiV1/router');

// Sanitycheck
var sanitycheck = require('./generic/sanitycheck');
app.use('/sanitycheck', sanitycheck);

//API - Version 1
app.use('/api/v1', apiV1);

// Export the app
module.exports = app;


