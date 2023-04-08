const router = require('express-promise-router')();
const { badRequest } = require('@hapi/boom');

const userController = require('../controllers/users.controller');
const { UserSchema } = require('../constants/schemas');
const { auth_middleware } = require('../utils/auth.middleware');

router.post('/signin', async (req, res) => {
	const { _value, error } = UserSchema.validate(req.body);

	if (error) throw badRequest(error.message);

	const data = await userController.signIn(req.body);

	res.send(data);
});

router.post('/signup', async (req, res) => {
	const { _value, error } = UserSchema.validate(req.body);

	if (error) throw badRequest(error.message);

	const data = await userController.signUp(req.body);
	
	res.send(data);
});

router.post('/signin/new_token', async (req, res) => {
	const refresh_token = req.body.refresh_token || req.headers['refresh_token'];

	if (!refresh_token) throw badRequest('Refresh token not provided');

	const tokens = await userController.refreshToken(refresh_token);
	
	res.send(tokens);
});

router.get('/info', auth_middleware, async (req, res) => {
	const user = await userController.getById(req.user.id);
	
	delete user.password;
	
	res.send({ data: user });
});

router.get('/logout', auth_middleware, async (req, res) => {
	await userController.logOut(req.token);
	res.status(204).send();
});


module.exports = router;