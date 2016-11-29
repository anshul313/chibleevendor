var session = {};
var jwt = require('jsonwebtoken');
var Users = require('mongoose').model('users');
// var Users = tables.loudshoutModUsers;
var config = require('config')

var response = {
	error: false,
	status: "",
	data: null,
	userMessage: ''
};
var sendResponse = function(res, status) {
	return res.status(status || 200).send(response);
}

session.checkPingToken = function(req, res, next) {

	var bearerToken;
	var bearerHeader = req.headers["authorization"];

	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		// bearerToken = bearerToken.slice(1, bearerToken.length).slice(0, -1);

	}

	var token = bearerToken || req.body.token || req.query.token;
	jwt.verify(token, config.sessionSecret, function(err, decoded) {
		if (err) {
			if (err.message == "jwt expired") {
				var token = bearerToken || req.body.token || req.query.token;

				Users.findOne({
					authToken: token
				}, function(err, user_data) {
					if (err || !user_data) {
						response.error = true;
						response.userMessage = "Your session has been expired. Please relogin.";
						return sendResponse(res, 401);
					} else {
						var token = jwt.sign({
							userID: user_data._id
						}, config.sessionSecret, {
							expiresIn: 60 * 60 * 120
						});
						user_data.authToken = token;
						user_data.save(function(err) {
							if (err) {
								response.error = true;
								response.userMessage = "Your session has been expired. Please relogin.";
								return sendResponse(res, 401);
							} else {
								response.error = false;
								response.status = 201;
								response.data = token;
								response.userMessage = "token Refresh"
								return sendResponse(res, 201);
							}
						})

					}
				});

			} else {
				response.error = true;
				response.status = 401;
				response.userMessage = "Your session has been expired. Please relogin.";
				return sendResponse(res, 401);
			}

		} else {
			Users.findById(decoded.userID, function(err, user_data) {
				var token = bearerToken || req.body.token || req.query.token;
				if (user_data && user_data.authToken == token) {
					req.user = user_data;
					next();
				} else {
					response.userMessage = "Your session has been expired. Please relogin.";
					return sendResponse(res, 401);
				}
			})
		}
	});


};

session.checkToken = function(req, res, next) {

	var bearerToken;
	var bearerHeader = req.headers["authorization"];

	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		// bearerToken = bearerToken.slice(1, bearerToken.length).slice(0, -1);

	}

	var token = bearerToken || req.body.token || req.query.token;
	console.log(token);
	jwt.verify(token, config.sessionSecret, function(err, decoded) {

		if (err) {
			console.log(err);
			response.userMessage = "Your session has been expired. Please relogin.";
			return sendResponse(res, 401);
		} else {
			console.log(decoded);
			Users.findById(decoded.userID)
				.then(function(user_data) {

					if (user_data && user_data.authToken == token) {
						req.user = user_data;

						next();
					} else {
						response.userMessage = "Your session has been expired. Please relogin.";
						return sendResponse(res, 401);
					}
				})
		}
	});


};

session.isSuperAdmin = function(req, res, next) {
	if (req.user && req.user.role == 10) {
		next()
	} else {
		req.isSuperAdmin = true;
		response.userMessage = "You are not authorized to do this.";
		return sendResponse(res, 403);
	}
}

session.checkV2Token = function(req, res, next) {
	var bearerToken;
	var bearerHeader = req.headers["authorization"];

	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;

	}

	var token = bearerToken || req.body.token || req.query.token;
	if (token === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NDY4MjI5MzEsImlkIjoiNTYzOWE5ODllMWVkNDU1MzlhM2FmNDE0Iiwib3JpZ19pYXQiOjE0NDY4MDEzMzF9.hsNA9cFAo1EF_MNUnxn-jsQ4zNknIf_ZHxwPdmzch9U") {
		next();
	} else {
		response.userMessage = "Your session has been expired. Please relogin.";
		return sendResponse(res, 401);
	}
}

module.exports = session;