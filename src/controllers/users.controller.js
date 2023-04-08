const bcrypt = require('bcrypt');
const { unauthorized, badRequest } = require('@hapi/boom');

require('dotenv').config();

const { DEFAULT_SALT_ROUNDS, DB_TABLES, JWT_LIFETIME } = require('../constants');
const { database } = require('../database');
const { generateJWT, parseToken } = require('../utils');

const salt = bcrypt.genSaltSync(DEFAULT_SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

class UsersController {

	constructor(table) {
		this.table = table || DB_TABLES.USERS;
	}

	async signUp (data) {
		const { id, password } = data;
		const passwordHashed = bcrypt.hashSync(password, salt);

		const user = await this.getById(id);
		
		if (user) throw badRequest('User with this login already exists');

		await database(this.table).insert({
			id, password: passwordHashed
		});

		return this.getTokens({ id });
	}

	async signIn (data) {
		const { id, password } = data;
    
		const user = await this.getById(id);
		if (!user) throw unauthorized('Auth failed');
    
		const userPassword = user.password;
    
		if (bcrypt.compareSync(password, userPassword)) {
			const payload = {
				id: user.id
			};

			return this.getTokens(payload);
		} else {
			throw unauthorized('Auth failed');
		}
	}

	async getById (id) {
		const user = await database(this.table).where({ id }).first();
		return user;
	}

	async insertRefreshToken (token, user_id) {
		await database(DB_TABLES.REFRESH_TOKENS).where({ user_id }).del();
		await database(DB_TABLES.REFRESH_TOKENS).insert({ token, user_id });
	}

	async refreshToken (token) {
		const payload = parseToken(token, jwtRefreshSecret);

		const data = await database(DB_TABLES.REFRESH_TOKENS).where({ user_id: payload.id }).first();
		if (data?.token && data.token == token) {
			return this.getTokens({ id: payload.id });
		} else {
			throw unauthorized('Refresh token not exists or already used');
		}
	}

	async getTokens (payload) {
		const token = generateJWT(payload, jwtSecret, { expiresIn: JWT_LIFETIME });
		const refresh_token = generateJWT(payload, jwtRefreshSecret);
		
		await this.insertRefreshToken(refresh_token, payload.id);
		
		return {
			token,
			refresh_token
		};
	}

	async logOut (token) {
		const { id } = parseToken(token, jwtSecret);
		await database(DB_TABLES.REFRESH_TOKENS).where({ user_id: id }).del();
		await database(DB_TABLES.BLOCKED_TOKENS).insert({ token });
	}
	
}

module.exports = new UsersController();