// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config();

module.exports = {
	development: {
		client: 'mysql2',
		connection: {
			host: process.env.MYSQL_HOST || '127.0.0.1',
			port: process.env.MYSQLDB_DOCKER_PORT,
			database: process.env.MYSQLDB_DATABASE,
			user:     process.env.MYSQLDB_ROOT_USER,
			password: process.env.MYSQLDB_ROOT_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/database/migrations',
		}
	},
};
