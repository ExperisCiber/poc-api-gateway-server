/**
 * Required modules
 */
var _ = require('lodash');

/**
 * Define the global config for every environment that will be merged with environment specific config files
 */
var config = {
  dev: 'dev',
  acc: 'acc',
  prd: 'prd',
  port: process.env.PORT || 5555
};
// Define variables
var envConfig;

// Set the proces.env.NODE_ENV, if it does exist use the default
process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
// Set the config.env
config.env = process.env.NODE_ENV;

/**
 * Try to load the envConfig file per development
 */
try{
  envConfig = require('./' + config.env );
  envConfig = envConfig || {};
} catch( e ){
  envConfig = {};
}

/**
 * Merge the 2 configs together
 * The envConfig will have the override properties per environment
 */
module.exports = _.merge(config, envConfig);
