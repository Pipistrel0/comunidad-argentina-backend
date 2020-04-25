const { config } = require("../../config/index");
const boom = require('@hapi/boom');

function withErrorStack(error, stack) {
	if (config.dev) {
		return { ...error, stack };
	}
	return error;
}

function wrapErrors(err, req, res, next){
	if(!err.isBoom()){
		next(boom.badImplementation());
	}
	next();
}

function logErrors(err, req, res, next) {
	next(err);
}

function errorHandler(err, req, res, next) { // eslint-disable-line
	const {output: {statusCode, payload}} = err
	res.status(statusCode || 500);
	res.json(withErrorStack(payload, err.stack));
}


module.exports = {
	logErrors,
	wrapErrors,
  errorHandler
}