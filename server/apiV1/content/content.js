var content = require('express').Router();
var cors = require('cors');
var request = require('request');
var config = require('../../config/config');

BASE_REST_URL = 'http://localhost:3000/api';

// Set variables
var corsOptions = config.cors.defaultApi.corsOptions;

// Hyperledger composer details
ApiIP = "http://localhost";
ApiPort = "3000";
Server = this.ApiIP + ":" + this.ApiPort;
ApiUrl = "/api/";
var ServerWithApiUrl = this.Server + this.ApiUrl;

/**
 * @func isJson
 * @desc Parse the output t Json
 * @param str The data
 */
function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

/**
 * @func GetContent
 * @desc Get all the API content
 * @param endpoint Endpoint for the required data
 * @param auth Provide optional authentication
 */
function getContent(endpoint, auth) {
	return new Promise((resolve, reject) => {
		request(BASE_REST_URL + endpoint, {
			headers: {
				'Authorization': 'Basic ' + auth
			}
		}, function (error, response, body) {
			if (!error) {
				if (isJson(body)) {
					resolve(JSON.parse(body));
				} else {
					reject(body);
				}
			} else {
				reject(error);
			}
		});
	});
}

/**
 * @func GetContractContent
 * @desc Get all the API content
 * @param endpoint Endpoint for the required data
 * @param auth Provide optional authentication
 */
function getContractContent(endpoint, auth) {
	return new Promise((resolve, reject) => {
		request(ServerWithApiUrl + endpoint, {
			headers: {
				'Authorization': 'Basic ' + auth
			}
		}, function (error, response, body) {
			if (!error) {
				if (isJson(body)) {
					resolve(JSON.parse(body));
				} else {
					reject(body);
				}
			} else {
				reject(error);
			}
		});
	});
}

/**
 * @func showReadableVersion
 * @desc Make a item readable for the Front-end
 * @param arrayItems Supply the content
 * @param type Supply the type of the item
 */
function showReadableVersion(arrayItems, type) {

	//Empty array
	var readableItems = [];

	// Loop through all the array Item
	arrayItems.forEach(function (item) {

		switch (type) {
			case 'contract':
				// Slice off "CON_" & Parse string into number
				item.contractId = parseInt(item.contractId.slice(4, 7));

				// Parse date to time (ISO Time)
				item.arrivalDateTime = new Date(item.arrivalDateTime).toString();

				// Slice items after the # symbol
				item.grower = item.grower.split('#').pop();
				item.shipper = item.shipper.split('#').pop();
				item.importer = item.importer.split('#').pop();

				readableItems.push(item);

			break;

			case 'production_lots':
				// Slice off "CON_" & Parse string into number
				item.productionLotId = parseInt(item.productionLotId.slice(4, 7));

				// Parse date to time (ISO Time)
				item.expirationDate = new Date(item.expirationDate).toString();

				// Slice items after the # symbol
				item.contract = item.contract.split('#').pop();

				readableItems.push(item);

			break;
		}

	});
	return readableItems;

}


/**
 * Get content
 * @desc Get all products from rest server
 */
content.options('/nodes/:type', cors(corsOptions))
content.get('/nodes/:type', cors(corsOptions), function (req, res, next) {

	ApiIP = "http://localhost";
	ApiPort = "3000";
	Server = this.ApiIP + ":" + this.ApiPort;
	ApiUrl = "/api/";
	ServerWithApiUrl = this.Server + this.ApiUrl;

	// var role = req.params.role;
	var type = req.params.type

	var promises = [];

	switch (type) {
		case 'importer':

			promises.push(getContractContent('createcontract', ''));
			promises.push(getContractContent('grower', ''));
			promises.push(getContractContent('shipper', ''));

			break;
		case 'grower':

			promises.push(getContractContent('ProductionLot', ''));
			promises.push(getContractContent('createcontract', ''));
			promises.push(getContractContent('products', ''));

			break;
	}

	// When all promises are fullfilled, return the data
	Promise.all(promises).then((results) => {
		if (results.length > 0) {

			switch (type) {
				case 'importer':

					// Change all details in the contracts
					results[0] = showReadableVersion(results[0], 'contract');


					res.status(200).json({
						contracts: results[0],
						growers: results[1],
						shippers: results[2]
					});
					break;
				case 'grower':

					// Change all details in the contracts
					results[0] = showReadableVersion(results[0], 'production_lots');


					res.status(200).json({
						Production_lots: results[0],
						contracts: results[1],
						products: results[2]
					});
					break;
			}
		};
	});
});

/**
 * Post value by formName
 */
content.options('/:type', cors(corsOptions))
content.post('/:type', cors(corsOptions), function (req, res, next) {
	// console.log(req);
	var type = req.params.type;
	var formArray = [];

	switch (type) {
		case 'setup':
			console.log("TEST API GATEWAY");
			break;
	}
	// switch (type) {
	// 	case 'contact':
	// 		if (req.body) {
	// 			// Make an empty array and add the corporate information as a first result.
	// 			var promises = [];
	// 			promises.push(getFile('v1/corporate-information', auth));

	// 			Promise.all(promises).then((results) => {
	// 				var form = req.body;
	// 				var userToken = req.body.user_token;
	// 				var postData = {
	// 					form: 'contact',
	// 					firstname: req.body.form.first_name,
	// 					lastname: req.body.form.last_name,
	// 					telephone: req.body.form.telephone,
	// 					email: req.body.form.email,
	// 					company: req.body.form.company,
	// 					message: req.body.form.message,
	// 					gender: req.body.form.gender ? req.body.gender : 'unknown',
	// 					campaignid: results[0][0].field_campaign_id
	// 				};
	// 				// POST TO CRM HERE
	// 				postToCrm(postData).then(function (result) {
	// 					res.status(200).json({
	// 						form_received: form
	// 					});
	// 				}, function (error) {
	// 					res.status(500).json({
	// 						error: 'Error adding to CRM'
	// 					});
	// 				});
	// 			}, function (error) {
	// 				res.status(400).json({
	// 					error: 'User Token Not Correct'
	// 				});
	// 			});
	// 		}

	// 		break;
	// 	case 'whitepaper':
	// 		// Set the File Directory
	// 		var fileDir = rootDir + '/server/files/whitepapers/';
	// 		// Get variables from the Request
	// 		var whitepaperID = req.body.whitepaper_id;
	// 		var userToken = req.body.user_token;
	// 		var userFirstname = req.body.form.firstName;
	// 		var userLastname = req.body.form.lastName;
	// 		var jobFunction = req.body.form.function;
	// 		var userGender = req.body.form.gender ? req.body.form.gender : 'unknown';
	// 		var userEmail = req.body.form.email;
	// 		var userTelephone = req.body.form.telephone;
	// 		var userCompanyName = req.body.form.company ? req.body.form.company : 'unknown';

	// 		// Get the Cookie Token ID
	// 		token_queries.getTokenID(userToken).then(function (result) {

	// 			var cookieTokenID = result[0].id;
	// 			if (result[0].user_id === 0) {
	// 				user_queries.createUser(userFirstname, userLastname, userEmail, userTelephone, userGender, userCompanyName).then(function (user_result) {
	// 					token_queries.updateTokenUserID(user_result.insertId, userToken).then(function (update_result) {
	// 					}, function (update_error) {

	// 					})
	// 				}, function (user_error) {
	// 					console.log("user_error", user_error);
	// 				});
	// 			}

	// 			var downloadFiles = [];
	// 			// Get Whitepapers from Drupal and Expiration Time
	// 			var promises = [];


	// 			promises.push(getFile('v1/download/whitepaper/' + whitepaperID, auth));
	// 			// When all promises are fullfilled, return the data
	// 			Promise.all(promises).then((results) => {

	// 				// Generate Downloadtoken
	// 				var downloadtoken = utils.generateDownloadToken(32);

	// 				// Generate expiration Timestamp
	// 				var timestamp_expired = utils.timestampFutureHours(results[0][0].field_expiration_time);
	// 				// Split the string to get all download files
	// 				results[0][0].field_whitepaper_file = results[0][0].field_whitepaper_file.split('||');
	// 				results[0][0].field_whitepaper_description = results[0][0].field_whitepaper_description.split('||');
	// 				results[0][0].field_whitepaper_id = results[0][0].field_whitepaper_id.split('||');

	// 				var mailDownloadURL;
	// 				// Loop through all the download files
	// 				results[0][0].field_whitepaper_file.forEach(function (element, index) {
	// 					var fileExtension = element.split('.')[1];
	// 					// var fileName = 'whitepaper_' + utils.generateDownloadToken(5) + '.' + fileExtension;
	// 					var fileToken = utils.generateDownloadToken(32);
	// 					// var tempFile = fs.createWriteStream(fileDir + fileName);
	// 					var downloadURL = envConfig.cms.protocol + envConfig.cms.host.replace(/\/$/, '') + element;
	// 					mailDownloadURL = envConfig.frontend.protocol + envConfig.frontend.host + results[0][0].path + '/' + downloadtoken;

	// 					// Add the Files to the Download Result
	// 					downloadFiles.push({
	// 						title: results[0][0].field_whitepaper_description[index],
	// 						file_token: fileToken
	// 					});

	// 					// Store the Download in the DB
	// 					queries.storeWhitepaperDownloads(cookieTokenID, downloadtoken, results[0][0].field_whitepaper_id[index], results[0][0].field_whitepaper_description[index], fileToken, timestamp_expired).then(function (result) {
	// 						if (index === (results[0][0].field_whitepaper_file.length - 1)) {
	// 							res.status(200).json({
	// 								download_token: downloadtoken,
	// 								file_tokens: downloadFiles,
	// 								token_expires: timestamp_expired
	// 							});
	// 						}
	// 					}, function (error) {
	// 						res.status(500).json({
	// 							error: 'error creating tokens',
	// 							err: error
	// 						});
	// 					});

	// 				}, this);

	// 				//create the post data
	// 				var postData = {
	// 					form: 'whitepaper',
	// 					firstname: userFirstname,
	// 					lastname: userLastname,
	// 					telephone: userTelephone,
	// 					email: userEmail,
	// 					gender: userGender,
	// 					function: jobFunction,
	// 					userToken: userToken,
	// 					company: userCompanyName,
	// 					downloadURL: mailDownloadURL,
	// 					campaignid: results[0][0].field_campaign_id,
	// 					expired: results[0][0].field_expiration_time
	// 				};

	// 				// POST TO CRM HERE
	// 				postToCrm(postData);

	// 			});
	// 		}, function (error) {
	// 			res.status(400).json({
	// 				error: 'User Token Not Correct'
	// 			});
	// 		});



	// 		break;
	// 	case 'landingpage':
	// 		// Set the File Directory
	// 		var fileDir = rootDir + '/server/files/landingpages/';

	// 		// Get variables from the Request
	// 		var landingpageID = req.body.landingpage_id;
	// 		var userToken = req.body.user_token;
	// 		var userFirstname = req.body.form.first_name;
	// 		var userLastname = req.body.form.last_name;
	// 		var userGender = req.body.form.gender ? '' : 'unknown';
	// 		var userEmail = req.body.form.email;
	// 		var userTelephone = req.body.form.telephone ? '' : 'unknown';
	// 		var jobTitle = req.body.form.jobtitle;
	// 		var userCompanyName = '';

	// 		var downloadFiles = [];
	// 		// Get Whitepapers from Drupal and Expiration Time
	// 		var promises = [];
	// 		promises.push(getFile('v1/download/landingpage/' + landingpageID, auth));


	// 		// Get the Cookie Token ID
	// 		token_queries.getTokenID(userToken).then(function (result) {
	// 			var cookieTokenID = result[0].id;
	// 			if (result[0].user_id === 0) {
	// 				user_queries.createUser(userFirstname, userLastname, userEmail, userTelephone, userGender, userCompanyName).then(function (user_result) {

	// 					token_queries.updateTokenUserID(user_result.insertId, userToken).then(function (update_result) {

	// 					}, function (update_error) {
	// 						console.log("update_error", update_error);

	// 					})
	// 				}, function (user_error) {
	// 					console.log("user_error", user_error);
	// 				});
	// 			}
	// 			var downloadFiles = [];
	// 			// Get Landingpage from Drupal and Expiration Time
	// 			var promises = [];
	// 			promises.push(getFile('v1/download/landingpage/' + landingpageID, auth));

	// 			Promise.all(promises).then((results) => {

	// 				// Generate Downloadtoken
	// 				var downloadtoken = utils.generateDownloadToken(32);

	// 				// Generate expiration Timestamp
	// 				var timestamp_expired = utils.timestampFutureHours(results[0][0].field_expiration_time);

	// 				// Split the string to get all download files
	// 				results[0][0].field_landing_page_file = results[0][0].field_landing_page_file.split('||');
	// 				results[0][0].field_landing_page_file_description = results[0][0].field_landing_page_file_description.split('||');
	// 				results[0][0].field_landing_page_file_id = results[0][0].field_landing_page_file_id.split('||');

	// 				var mailDownloadURL;
	// 				// Loop through all the download files
	// 				results[0][0].field_landing_page_file.forEach(function (element, index) {

	// 					//Split the file on the extension type
	// 					var fileExtension = element.split('.')[1];

	// 					// Generate a filetoken
	// 					var fileToken = utils.generateDownloadToken(32);

	// 					//Create a downloadURL
	// 					var downloadURL = envConfig.cms.protocol + envConfig.cms.host.replace(/\/$/, '') + element;

	// 					//Create a link to download the file
	// 					mailDownloadURL = envConfig.frontend.protocol + envConfig.frontend.host + results[0][0].path + '/' + downloadtoken;

	// 					// Add the Files to the Download Result
	// 					downloadFiles.push({
	// 						title: results[0][0].field_landing_page_file_description[index],
	// 						file_token: fileToken
	// 					});

	// 					// Store the Download in the DB
	// 					queries.storeWhitepaperDownloads(cookieTokenID, downloadtoken, results[0][0].field_landing_page_file_id[index], results[0][0].field_landing_page_file_description[index], fileToken, timestamp_expired).then(function (result) {
	// 						if (index === (results[0][0].field_landing_page_file.length - 1)) {
	// 							res.status(200).json({
	// 								download_token: downloadtoken,
	// 								file_tokens: downloadFiles,
	// 								token_expires: timestamp_expired
	// 							});
	// 						}
	// 					}, function (error) {
	// 						res.status(500).json({
	// 							error: 'error creating tokens',
	// 							err: error
	// 						});
	// 					});

	// 				}, this);

	// 				// Get variables from the Request
	// 				var landingpageID = req.body.landingpage_id;
	// 				var userToken = req.body.user_token;
	// 				var userFirstname = req.body.form.first_name;
	// 				var userLastname = req.body.form.last_name;
	// 				var userGender = req.body.form.gender ? '' : 'unknown';
	// 				var userEmail = req.body.form.email;
	// 				var userTelephone = req.body.form.telephone ? '' : 'unknown';
	// 				var jobTitle = req.body.form.jobtitle;
	// 				var userCompanyName = '';

	// 				//create the post data
	// 				var postData = {
	// 					form: 'landingpage',
	// 					firstname: userFirstname,
	// 					lastname: userLastname,
	// 					telephone: userTelephone,
	// 					email: userEmail,
	// 					gender: userGender,
	// 					function: jobTitle,
	// 					userToken: userToken,
	// 					company: userCompanyName,
	// 					downloadURL: mailDownloadURL,
	// 					campaignid: results[0][0].field_campaign_id,
	// 					expired: results[0][0].field_expiration_time
	// 				};

	// 				// POST TO CRM HERE
	// 				postToCrm(postData);

	// 			});



	// 		}, function (error) {
	// 			res.status(400).json({
	// 				error: 'User Token Not Correct'
	// 			});
	// 		});
	// 		break;
	// 	default:
	// 		res.status(500).json({
	// 			form: 'No body sent',
	// 		});
	// 		break;

	// }

});

// app.use(bodyParser.json());
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
// })

// var api = express.Router();
// var auth = express.Router();


// api.get('/messages', (req, res) => {
//     res.json(messages);
// })

// api.get('/messages/:user', (req, res) => {
//     var user = req.params.user;
//     var result = messages.filter(message => message.owner == user);

//     res.json(result);
// })

// api.post('/messages', (req, res) => {
//     messages.push(req.body);
//     res.json(req.body);
// })

// api.get('/users/me', checkAuthenticated, (req,res) => {
//     res.json(users[req.user]);
// })

// api.post('/users/me', checkAuthenticated, (req,res) => {
//     var user = users[req.user];

//     user.firstName = req.body.firstName;
//     user.lastName = req.body.lastName;

//     res.json(user);
// })

// auth.post('/login', (req, res) => {
//     var user = users.find(user => user.email == req.body.email);

//     if (!user) 
//         sendAuthError(res);

//     if (user.password == req.body.password)
//         sendToken(user, res);
//     else
//         sendAuthError(res);
// })

// auth.post('/register', (req, res) => {
//     var index = users.push(req.body) - 1;

//     var user = users[index];
//     user.id = index;

//     sendToken(user, res);
// })

// function sendToken(user, res) {
//     var token = jwt.sign(user.id, '123');
//     res.json({ firstName: user.firstName, token });
// }

// function sendAuthError(res) {
//     return res.json({ success: false, message: 'email or password incorrect' });
// }

// function checkAuthenticated(req, res, next) {
//     if(!req.header('authorization'))
//         return res.status(401).send({message: 'Unauthorized requested. Missing authentication header'});

//     var token = req.header('authorization').split(' ')[1];

//     var payload = jwt.decode(token, '123');

//     if(!payload)
//         return res.status(401).send({message: 'Unauthorized requested. Authentication header invalid'});

//     req.user = payload;

//     next();
// }

// app.use('/api', api);
// app.use('/auth', auth);


// app.listen(63145);

module.exports = content;