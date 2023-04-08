const cron = require('node-cron');
const moment = require('moment');

const { database } = require('../database');
const { DB_TABLES, TOKENS_REMOVAL_PERIOD } = require('../constants');

// Remove old blocked tokens
cron.schedule(`*/${TOKENS_REMOVAL_PERIOD} * * * *`, async () => {
	try {
		const tokenExpirationMinutes = moment().format('YYYY-MM-DD HH:mm:ss');
		await database(DB_TABLES.BLOCKED_TOKENS).whereRaw('created_at >= ?', [tokenExpirationMinutes]).del();
	} catch(err) {
		console.error('Error during cron task ', err);
	}
});