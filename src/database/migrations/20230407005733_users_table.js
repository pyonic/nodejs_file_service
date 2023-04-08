exports.up = function(knex) {
	return knex.schema
		.createTable('users', (table) => {
			table.string('id').primary();
			table.string('password').notNullable();
			table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
			table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		});
};

exports.down = function(knex) {
	return knex.schema.dropTable('users');
};
