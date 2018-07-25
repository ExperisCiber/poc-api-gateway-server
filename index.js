/**
 * Require our modules
 */
var config = require('./server/config/config');

var app = require('./server/server');
/**
 * Start the server
 */
app.listen(config.port);