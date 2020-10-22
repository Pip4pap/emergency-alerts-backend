const webSocket = require('websocket').server;
const wsCatchAsync = require('./utils/wsCatchAsync.js');
const { Crash, Hospital } = require('./models/sequelize');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const { Op } = require('sequelize');
const GM = require('./utils/googlemaps');

module.exports = (server) => {
  const wsServer = new webSocket({
    httpServer: server,
    autoAcceptConnections: true,
  });

  wsServer.on('connect', (connection) => {
    let Interval, hospitalID, hospitalPlaceID;
    connection.on('message', (message) => {
      console.log('Received Message:', message.utf8Data);
      let splitMessage = message.utf8Data.split(' ');
      console.log(splitMessage[0]);
      connection.sendUTF('Received Command:' + splitMessage[0]);

      if (splitMessage[0] === 'setHospitalDetails') {
        hospitalID = splitMessage[1];
        hospitalPlaceID = splitMessage[2];
      } else if (splitMessage[0] === 'acceptCrash') {
        //To have hospitalID and CrashID
      } else if (splitMessage[0] === 'denyCrash') {
      }
      console.log(
        'IF MESSAGE IS RECIECVED FROM HOSPITAL TO ACCEPT A CRASH, CHANGE ITS STATUS TO ACCEPTED AND OTHERS AS VIEWED'
      );
    });

    connection.on('close', function (reasonCode, description) {
      clearTimeout(Interval);
      console.log('Client has disconnected.');
    });

    Interval = setInterval(
      wsCatchAsync(async () => {
        console.log('GET ALL EMERGENCY CRASHES');
        let emCrashes = await Crash.findAll({
          where: {
            timestamp: {
              [Op.gt]: new Date(new Date() - 30 * 60 * 1000),
            },
          },
        });
        console.log('fILTER OUT THOSE THAT ARE CLOSE TO HOSPITAL');
        let closeCrashes = await GM.determineIfNearbyCrash(hospitalPlaceID, emCrashes);
        // console.log(closeCrashes);
        console.log('ADD THE FILTERED CRASHES TO HOSPITAL WITH DEFAULT STATUS PENDING');
        let hospital = await Hospital.findByPk(hospitalID);
        // console.log(hospital);
        await hospital.addCrashes(closeCrashes);
        console.log(
          'RETURN ONLY THE EM CRASHES THAT HAVE BEEN ATTACHED TO A HOSPITAL BACK TO THE CLIENT WITH STATUS PENDING'
        );

        let hospitalEmCrashes = await hospital.getCrashes({
          through: {
            where: {
              status: 'pending',
            },
          },
        });
        // console.log(hospitalEmCrashes);
        connection.send(JSON.stringify(hospitalEmCrashes));
        console.log(
          'IF A CRASH IS NOT ACCEPTED IN 30 MINS ITS STATUS SHOULD CHANGE TO VIEWED IN that ATTACHED HOSPITAL'
        );
        let hospitalExpiredEmCrashes = await hospital.getCrashes({
          where: {
            timestamp: {
              [Op.lt]: new Date(new Date() - 30 * 60 * 1000),
            },
          },
          through: {
            where: {
              status: 'pending',
            },
          },
        });
        for (let crash of hospitalExpiredEmCrashes) {
          crash.HospitalCrash.status = 'viewed';
          await crash.HospitalCrash.save();
        }
        console.log(hospitalExpiredEmCrashes);
        // end of Timeout
      }),
      5000
    );
  });
  wsServer.on('close', (connection, closeReason, description) => {
    console.log(`Peer ${connection.remoteAddress} disconnected. with reason ${closeReason}: ${description}`);
  });
};
