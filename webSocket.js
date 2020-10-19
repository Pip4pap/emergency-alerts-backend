const webSocket = require('websocket').server;
const app = require('server.js');
const CatchAsync = require('./utils/wsCatchAsync.js');

const wsServer = new webSocket({
  server: app,
  autoAcceptConnections: true,
});

wsServer.on('connect', (connection) => {
  connection.on('message', (message) => {
    console.log('Received Message:', message.utf8Data);
    connection.sendUTF(message.utf8Data);
    console.log(
      'IF MESSAGE IS RECIECVED FROM HOSPITAL TO ACCEPT A CRASH, CHANGE ITS STATUS TO ACCEPTED AND OTHERS AS VIEWED'
    );
  });

  connection.on('close', function (reasonCode, description) {
    console.log('Client has disconnected.');
  });

  setInterval(
    catchAsync(async () => {
      console.log('GET ALL EMERGENCY CRASHES');
      console.log('fILTER OUT THOSE THAT ARE CLOSE TO HOSPITAL');
      console.log('ADD THE FILTERED CRASHES TO HOSPITAL WITH DEFAULT STATUS PENDING');
      console.log(
        'RETURN ONLY THE EM CRASHES THAT HAVE BEEN ATTACHED TO A HOSPITAL BACK TO THE CLIENT WITH STATUS PENDING'
      );
      console.log(
        'IF A CRASH IS NOT ACCEPTED INgit  30 MINS ITS STATUS SHOULD CHANGE TO VIEWED IN ALL ATTACHED HOSPITALS'
      );
    }),
    5000
  );
});
wsServer.on('close', (connection, closeReason, description) => {
  console.log(`Peer ${connection.remoteAddress} disconnected.`);
});
