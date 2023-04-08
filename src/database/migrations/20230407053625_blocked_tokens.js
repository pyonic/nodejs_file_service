exports.up = function(knex) {
	return knex.schema
		.createTable('blocked_tokens', (table) => {
			table.string('token').primary();
			table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
		});
};

exports.down = function(knex) {
	return knex.schema.dropTable('blocked_tokens');
};
