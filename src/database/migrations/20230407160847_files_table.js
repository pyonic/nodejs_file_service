exports.up = function(knex) {
	return knex.schema
		.createTable('files', (table) => {
			table.uuid('id').primary();
			table.string('filename').notNullable();
			table.string('originalname').notNullable();
			table.string('extension');
			table.string('mimetype');
			table.bigInteger('size');
			table.string('user_id').references('id').inTable('users');
			table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
			table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		});
};

exports.down = function(knex) {
	return knex.schema.dropTable('files');
};
