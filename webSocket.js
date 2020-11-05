const webSocket = require('websocket').server;
const wsCatchAsync = require('./utils/wsCatchAsync.js');
const {
    Crash,
    Hospital,
    HospitalCrash,
    Police,
    PoliceCrash
} = require('./models/sequelize');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const {Op} = require('sequelize');
const GM = require('./utils/googlemaps');
const Sequelize = require('sequelize')

module.exports = (server) => {
    const wsServer = new webSocket({httpServer: server, autoAcceptConnections: true});
    wsServer.on('connect', (connection) => {
        let Interval,
            emergencyPlaceID,
            emergencyPlaceGoogleID,
            tag;
        connection.on('message', async (message) => {
            console.log('Received Message:', message.utf8Data);
            let splitMessage = message.utf8Data.split(' ');
            console.log(splitMessage[1]);
            connection.sendUTF('Received Command:' + splitMessage[1]);

            let joinTable = splitMessage[0] === 'police' ? {
                table: PoliceCrash,
                column: PoliceID
            } : {
                table: HospitalCrash,
                column: HospitalID
            }
            if (splitMessage[1] === 'setDetails') {
                emergencyPlaceID = splitMessage[2];
                emergencyPlaceGoogleID = splitMessage[3];
                tag = splitMessage[0];
            } else if (splitMessage[1] === 'acceptCrash') {
                await joinTable.table.update({
                    status: 'accepted'
                }, {
                    where: {
                        [joinTable.column]: splitMessage[2],
                        CrashID: splitMessage[3]
                    }
                })
                let restOfPlaces = await joinTable.table.findAll({
                    where: {
                        CrashID: splitMessage[3],
                        status: "pending"
                    }
                })
                restOfPlaces.forEach(async () => {
                    await joinTable.update({
                        status: "viewed"
                    }, {
                        where: {
                            CrashID: splitMessage[3],
                            status: "pending"
                        }
                    })
                })
            } else if (splitMessage[1] === 'denyCrash') {
                await joinTable.table.update({
                    status: 'rejected'
                }, {
                    where: {
                        [joinTable.column]: splitMessage[1],
                        CrashID: splitMessage[2]
                    }
                })
            }
        });

        connection.on('close', function (reasonCode, description) {
            clearTimeout(Interval);
            console.log('Client has disconnected.');
        });

        Interval = setInterval(wsCatchAsync(async () => {
            let table,
                joinTable;
            table = tag === 'police' ? Police : Hospital;
            joinTable = tag === 'police' ? PoliceCrash : HospitalCrash;
            console.log('GET ALL EMERGENCY CRASHES');
            // console.log('Received Message:', hospitalID);
            // console.log('Received Message:', hospitalPlaceID);

            let emCrashes = await Crash.findAll({
                where: {
                    timestamp: {
                        [Op.gt]: new Date(new Date() - 30 * 60 * 1000)
                    }
                }
            });
            console.log('FILTER OUT THOSE THAT ARE CLOSE TO HOSPITAL');
            let closeCrashes = await GM.determineIfNearbyCrash(emergencyPlaceGoogleID, emCrashes);
            console.log(closeCrashes);
            console.log('ADD THE FILTERED CRASHES TO HOSPITAL WITH DEFAULT STATUS PENDING');
            let tableObject = await table.findByPk(emergencyPlaceID);
            console.log(tableObject);
            // Look at this function for errors
            await tableObject.addCrashes(closeCrashes);
            console.log('RETURN ONLY THE EM CRASHES THAT HAVE BEEN ATTACHED TO A HOSPITAL BACK TO THE CLIENT WITH STATUS PENDING');

            let placeEmCrashes = await tableObject.getCrashes({
                through: {
                    where: {
                        status: 'pending'
                    }
                }
            });
            console.log(placeEmCrashes);
            connection.send(JSON.stringify(placeEmCrashes));
            console.log('IF A CRASH IS NOT ACCEPTED IN 30 MINS ITS STATUS SHOULD CHANGE TO VIEWED IN that ATTACHED HOSPITAL');
            let placeExpiredEmCrashes = await tableObject.getCrashes({
                where: {
                    timestamp: {
                        [Op.lt]: new Date(new Date() - 30 * 60 * 1000)
                    }
                },
                through: {
                    where: {
                        status: 'pending'
                    }
                }
            });
            for (let crash of placeExpiredEmCrashes) {
                crash.joinTable.status = 'viewed';
                await crash.joinTable.save();
            }
            console.log(placeExpiredEmCrashes);
        }), 5000);
    });
    wsServer.on('close', (connection, closeReason, description) => {
        console.log(`Peer ${
            connection.remoteAddress
        } disconnected. with reason ${closeReason}: ${description}`);
    });
};
