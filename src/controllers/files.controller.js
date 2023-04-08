const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();

const { DB_TABLES, UPLOADS_FOLDER } = require('../constants');
const { database } = require('../database');
const { notFound, methodNotAllowed } = require('@hapi/boom');

class FilesController {

	constructor(table) {
		this.table = table || DB_TABLES.FILES;
	}

	async insertFile (data) {
		const { filename, originalname, size, mimetype } = data.file;
		const { id: user_id } = data.user;
		
		const id = crypto.randomUUID();

		const extension = this.getFileExtension(filename);

		const fileData = { id, filename, originalname, size, mimetype, extension, user_id };

		await database(this.table).insert(fileData);

		return fileData;
	}

	async updateFile (data) {
		const { filename, originalname, size, mimetype } = data.file;
		const { file_id } = data;
		const { id: user_id } = data.user;

		const file = await this.getById(file_id);

		if (!file) throw notFound('File not exists');
		else if (file.user_id !== user_id) throw methodNotAllowed('User can not update this file.');

		const filepath = path.resolve(`${UPLOADS_FOLDER}/${file.filename}`);
		
		// Remove previous file
		try {
			await fs.promises.unlink(filepath);
		} catch (error) { /* empty */ }

		const extension = this.getFileExtension(filename);

		const fileData = { filename, originalname, size, mimetype, extension };

		await database(this.table).where({ id: file_id }).update(fileData);

		return fileData;
	}

	async getFiles(data) {
		const { list_size = 10, page = 1, user } = data;
		const skip = list_size * (page - 1);
		const files = await database(this.table).where({ user_id: user.id }).offset(skip).limit(list_size);
		return { files, list_size, page, amount: files.length };
	}

	async deleteFile(data) {
		const { id } = data;

		const filepath = await this.getFilePath(data);
		
		const fileOperations = [ database(this.table).where({ id }).first().del() ];

		try {
			await fs.promises.access(filepath, fs.constants.R_OK);
			fileOperations.push(fs.promises.unlink(filepath));
		} catch (error) { /* empty */ }

		await Promise.all(fileOperations);

		return null;
	}

	async getFilePath (data) {
		const { id, user_id } = data;

		const file = await this.getById(id);

		if (!file) throw notFound('File not exists');
		if (file.user_id !== user_id) throw methodNotAllowed('Access denied for removal');

		return path.resolve(`${UPLOADS_FOLDER}/${file.filename}`);
	}

	async getById(id) {
		return database(this.table).where({ id }).first();
	}

	getFileExtension (filename) {
		const fileExtension = filename.split('.').pop();
		return fileExtension;
	}
}

module.exports = new FilesController();