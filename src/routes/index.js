const { auth_middleware } = require('../utils/auth.middleware');

const router = require('express-promise-router')();

router.use('/', require('./users.router'));
router.use('/file', auth_middleware, require('./files.router'));

module.exports = router;