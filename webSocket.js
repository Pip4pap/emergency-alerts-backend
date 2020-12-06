const webSocket = require('websocket').server;
const wsCatchAsync = require('./utils/wsCatchAsync.js');
const { Crash, Hospital, HospitalCrash, Police, PoliceCrash } = require('./models/sequelize');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const { Op } = require('sequelize');
const GM = require('./utils/googlemaps');
const Sequelize = require('sequelize');

module.exports = (server) => {
  const wsServer = new webSocket({ httpServer: server, autoAcceptConnections: true });
  wsServer.on('connect', (connection) => {
    let Interval, emergencyPlaceID, emergencyPlaceGoogleID, tag;
    connection.on('message', async (message) => {
      let clientMessage = JSON.parse(message.utf8Data);
      console.log('Received command:', clientMessage.command);
      console.log('Received message:', clientMessage);
      const [clientTag, command, placeID, googlePlaceID] = Object.keys(clientMessage);
      let joinTable =
        clientMessage.tag === 'police'
          ? {
              table: PoliceCrash,
              column: placeID,
            }
          : {
              table: HospitalCrash,
              column: placeID,
            };
      if (clientMessage.command === 'setDetails') {
        emergencyPlaceID = clientMessage[placeID];
        emergencyPlaceGoogleID = clientMessage.googlePlaceID;
        tag = clientMessage.tag;
      } else if (clientMessage.command === 'acceptCrash') {
        await joinTable.table.update(
          {
            status: 'accepted',
          },
          {
            where: {
              [joinTable.column]: clientMessage[placeID],
              CrashID: clientMessage.alertID,
            },
          }
        );
        let restOfPlaces = await joinTable.table.findAll({
          where: {
            CrashID: clientMessage.alertID,
            status: 'pending',
          },
        });
        restOfPlaces.forEach(async () => {
          await joinTable.table.update(
            {
              status: 'viewed',
            },
            {
              where: {
                CrashID: clientMessage.alertID,
                status: 'pending',
              },
            }
          );
        });
      } else if (clientMessage.command === 'denyCrash') {
        await joinTable.table.update(
          {
            status: 'rejected',
          },
          {
            where: {
              [joinTable.column]: clientMessage[placeID],
              CrashID: clientMessage.alertID,
            },
          }
        );
      }
    });

    connection.on('close', function (reasonCode, description) {
      clearTimeout(Interval);
      console.log('Client has disconnected.');
    });

    Interval = setInterval(
      wsCatchAsync(async () => {
        let table, joinTable;
        table = tag === 'police' ? Police : Hospital;
        joinTable = tag === 'police' ? PoliceCrash : HospitalCrash;
        // console.log('GET ALL EMERGENCY CRASHES');
        // console.log('Received Message:', hospitalID);
        // console.log('Received Message:', hospitalPlaceID);

        let emCrashes = await Crash.findAll({
          where: {
            timestamp: {
              [Op.gt]: new Date(new Date() - 30 * 60 * 1000),
            },
          },
        });
        // console.log('FILTER OUT THOSE THAT ARE CLOSE TO HOSPITAL');
        let closeCrashes = await GM.determineIfNearbyCrash(emergencyPlaceGoogleID, emCrashes, tag);
        // console.log(closeCrashes);
        // console.log('ADD THE FILTERED CRASHES TO HOSPITAL WITH DEFAULT STATUS PENDING');
        let tableObject = await table.findByPk(emergencyPlaceID);
        // Look at this function for errors
        await tableObject.addCrashes(closeCrashes);
        // console.log('RETURN ONLY THE EM CRASHES THAT HAVE BEEN ATTACHED TO A HOSPITAL BACK TO THE CLIENT WITH STATUS PENDING');

        let placeEmCrashes = await tableObject.getCrashes({
          through: {
            where: {
              status: 'pending',
            },
          },
        });
        // console.log(placeEmCrashes);
        connection.send(JSON.stringify(placeEmCrashes));
        // console.log('IF A CRASH IS NOT ACCEPTED IN 30 MINS ITS STATUS SHOULD CHANGE TO VIEWED IN that ATTACHED HOSPITAL');
        let placeExpiredEmCrashes = await tableObject.getCrashes({
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
        for (let crash of placeExpiredEmCrashes) {
          crash.joinTable.status = 'viewed';
          await crash.joinTable.save();
        }
        // console.log(placeExpiredEmCrashes);
      }),
      5000
    );
  });
  wsServer.on('close', (connection, closeReason, description) => {
    console.log(`Peer ${connection.remoteAddress} disconnected. with reason ${closeReason}: ${description}`);
  });
};
