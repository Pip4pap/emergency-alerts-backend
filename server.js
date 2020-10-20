const express = require('express');
const webSocket = require('websocket').server;
const catchAsync = require('./utils/wsCatchAsync.js');
const bodyParser = require('body-parser');
const sanitizer = require('express-sanitizer');
const xss = require('xss-clean');
const cors = require('cors');
const request = require('request-promise');
const dotenv = require('dotenv');

// Set the env variables
dotenv.config({path: '.env'});

const AppError = require('./utils/appError');
const hospitalAdminRouter = require('./routes/hospital_admin');
const admin = require('./routes/admin.js')
const hospitalRouter = require('./routes/hospital');
const riderRouter = require('./routes/rider');
const crashRouter = require('./routes/crash');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// -------------------Enable CORS for all origins-------------------
app.use(cors());

// -------------------Parsing APP data-------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

// -------------------Data sanitization against SQL injection attacks-------------------
app.use(sanitizer());

// -------------------Data sanitization against xss attacks-------------------
app.use(xss());

// GLOBAL MIDDLEWARE

app.get('/api', (req, res) => {
    res.json({message: 'Welcome to the Emergency alerts system'});
});

app.use('/api/hospitalAdmin', hospitalAdminRouter);
app.use('/api/admin', admin)
app.use('/api/hospital', hospitalRouter);
app.use('/api/rider', riderRouter);
app.use('/api/crash', crashRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${
        req.originalUrl
    } on this server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});

// Creation of the web socket
const wsServer = new webSocket({httpServer: server, autoAcceptConnections: true});

wsServer.on('connect', (connection) => {
    connection.on('message', (message) => {
        console.log('Received Message:', message.utf8Data);
        connection.sendUTF(message.utf8Data);
        console.log('IF MESSAGE IS RECIECVED FROM HOSPITAL TO ACCEPT A CRASH, CHANGE ITS STATUS TO ACCEPTED AND OTHERS AS VIEWED');
    });

    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });

    setInterval(catchAsync(async () => {
        console.log('GET ALL EMERGENCY CRASHES');
        console.log('fILTER OUT THOSE THAT ARE CLOSE TO HOSPITAL');
        console.log('ADD THE FILTERED CRASHES TO HOSPITAL WITH DEFAULT STATUS PENDING');
        console.log('RETURN ONLY THE EM CRASHES THAT HAVE BEEN ATTACHED TO A HOSPITAL BACK TO THE CLIENT WITH STATUS PENDING');
        console.log('IF A CRASH IS NOT ACCEPTED INgit  30 MINS ITS STATUS SHOULD CHANGE TO VIEWED IN ALL ATTACHED HOSPITALS');
    }), 5000);
});
wsServer.on('close', (connection, closeReason, description) => {
    console.log(`Peer ${
        connection.remoteAddress
    } disconnected.`);
});

module.exports = app;
