exports.up = function(knex) {
	return knex.schema
		.createTable('refresh_tokens', (table) => {
			table.string('token');
			table.string('user_id').notNullable().primary();
		});
};

exports.down = function(knex) {
	return knex.schema.dropTable('refresh_tokens');
};
