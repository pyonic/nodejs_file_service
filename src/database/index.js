const configuration = require('../../knexfile');

const database = require('knex')(configuration.development);

module.exports = {
	database
};