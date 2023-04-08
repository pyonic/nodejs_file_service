const joi = require('joi');

const UserIdSchema = joi.alternatives().try(
	joi.string().email(),
	joi.string().pattern(/^\d{10}$/)
).label('Email or phone number');

const UserPasswordSchema = joi.string().min(8).max(12).required();
	
const UserSchema = joi.object().keys({
	id: UserIdSchema,
	password: UserPasswordSchema
});

module.exports = {
	UserSchema
};