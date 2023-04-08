const DEFAULT_SALT_ROUNDS = 10;
const JWT_LIFETIME = '10m';

// Можно настроить на удаление каждые 24 часа, или каждый час (задавать в минутах)
const TOKENS_REMOVAL_PERIOD = '10';
const UPLOADS_FOLDER = 'src/uploads/';

const DB_TABLES = {
	USERS: 'users',
	REFRESH_TOKENS: 'refresh_tokens',
	BLOCKED_TOKENS: 'blocked_tokens',
	FILES: 'files'
};

module.exports = {
	DB_TABLES,
	DEFAULT_SALT_ROUNDS,
	JWT_LIFETIME,
	TOKENS_REMOVAL_PERIOD,
	UPLOADS_FOLDER
};
