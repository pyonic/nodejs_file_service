/* eslint-disable no-unused-vars */
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.APPLICATION_PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(cors({
	origin: '*'
}));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/api', require('./routes'));

app.use((err, req, res, next) => {
	const status = (err.output && err.output.statusCode) || 500;
	res.status(status).send({ error: err.message });
});

app.use((_req, res, next) => {
	res.status(404).json({ message: 'Url or resource not found' });
});

app.listen(PORT, () => {
	console.log(`Server 2 started at port ${PORT}`);
});

require('./tasks/schedules');