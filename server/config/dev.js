/**
 * CONFIG --- DEVELOPMENT
 */
module.exports = {
    // Enable logging
    logging: true,
    // Define CORS Request Origins
    cors: {
      defaultApi: {
        corsOptions: {
          origin: function (origin, callback) {
  
            // if (envConfig.cors.defaultApi.whitelist.indexOf(origin) !== -1) {
            //   callback(null, true)
            // } else {
            //   callback(new Error('Not allowed by CORS'))
            // }
            callback(null, true)
          },
          credentials: true
        },
        whitelist: [undefined, 'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop', 'http://localhost:1337', 'http://localhost:4000', 'http://localhost:4200', 'http://localhost:8000', 'http://localhost:8080', 'https://www.ciber.nl']
      }
    },
    database: {
      host: 'localhost',
      port: 3306,
      user: 'ciber',
      password: 'ciber',
      database: 'ciber-api-gateway',
      dialect: 'mysql',
    },
    cms: {
      protocol: 'http://',
      host: 'ciber3.loc/',
      apiEndpoint: 'api/'
    },
    frontend: {
      protocol: 'http://',
      host: 'localhost:4200',
    }
  }