const jwt = require('jsonwebtoken');
const { database } = require('../database');
const { DB_TABLES } = require('../constants');

const getToken = (request) => {
	const authorization = request.get('Authorization');
	return authorization && authorization.replace('Bearer ', '') || null;
};

const generateJWT = (data, key, options = {}) => {
	const token = jwt.sign(data, key, options);
	return token;
};

const getBlockedTokens = async () => {
	const data = await database(DB_TABLES.BLOCKED_TOKENS).select();
	const tokens = data.map(token_data => token_data.token);
	return tokens;
};

const parseToken = (token, key) => {
	return jwt.verify(token, key);
};

module.exports = {
	getToken,
	parseToken,
	generateJWT,
	getBlockedTokens
};