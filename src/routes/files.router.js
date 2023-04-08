const router = require('express-promise-router')();
const multer = require('multer');
const path = require('node:path');

const FilesController = require('../controllers/files.controller');
const { UPLOADS_FOLDER } = require('../constants');
const { notFound, methodNotAllowed } = require('@hapi/boom');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve(UPLOADS_FOLDER));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '_';
		cb(null, uniqueSuffix+file.originalname);
	}
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
	const file = await FilesController.insertFile({ file: req.file, user: req.user });
	res.send({ file });
});

router.get('/list', async (req, res) => {
	const { list_size, page } = req.query;
	const data = await FilesController.getFiles({ list_size, page, user: req.user });
	res.send(data);
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await FilesController.deleteFile({ id, user_id: req.user.id });
	res.status(204).send();
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const file = await FilesController.getById(id);
	
	if (!file) throw notFound('File not exists');
	if (file.user_id !== req.user.id) throw methodNotAllowed('Access denied for removal');

	res.send({ data: file });
});

router.get('/download/:id', async (req, res) => {
	const { id } = req.params;
	const filePath = await FilesController.getFilePath({ id, user_id: req.user.id });
	res.download(filePath);
});


router.put('/update/:id', upload.single('file'), async (req, res) => {
	const file = await FilesController.updateFile({ file_id: req.params.id, file: req.file, user: req.user });
	res.send({ file });
});

module.exports = router;