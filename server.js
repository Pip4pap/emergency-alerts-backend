const express = require('express');
const bodyParser = require('body-parser');
const sanitizer = require('express-sanitizer');
const xss = require('xss-clean');
const cors = require('cors');
const request = require('request-promise');
const dotenv = require('dotenv');

// Set the env variables
dotenv.config({ path: '.env' });

const AppError = require('./utils/appError');
const hospitalAdminRouter = require('./routes/hospital_admin');
const hospitalRouter = require('./routes/hospital');
const riderRouter = require('./routes/rider');
const crashRouter = require('./routes/crash');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// -------------------Enable CORS for all origins-------------------
app.use(cors());

// -------------------Parsing APP data-------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// -------------------Data sanitization against SQL injection attacks-------------------
app.use(sanitizer());

// -------------------Data sanitization against xss attacks-------------------
app.use(xss());

// GLOBAL MIDDLEWARE

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Emergency alerts system' });
});

app.use('/api/hospitalAdmin', hospitalAdminRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/rider', riderRouter);
app.use('/api/crash', crashRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
