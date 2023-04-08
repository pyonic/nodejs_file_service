const { unauthorized } = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const { getToken } = require('.');
const { getBlockedTokens } = require('./index');
const userController = require('../controllers/users.controller');

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

exports.auth_middleware = async (req, _res, next) => {
	try {
		const token = getToken(req);
		const blocked_tokens = await getBlockedTokens();

		if (token && !blocked_tokens.includes(token)) {
			const payload = jwt.verify(token, jwtSecret);
			
			const user = await userController.getById(payload.id);
			if (!user) throw unauthorized('Authorization error');

			else {
				req.user = user;
				req.token = token;
			}

			next();
		} else {
			throw unauthorized('Authorization error.');
		}
	} catch (e) {
		next(e);
	}
};
