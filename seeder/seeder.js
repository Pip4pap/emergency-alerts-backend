const db = require('../models/sequelize.js');
// TODO: Using one seed file is not a scalable solution, Will have to use json files in the future
const seeds = require('./seeds.js');

async function seedDev() { // Modify the database structure
    await db.sequelize.sync({force: true}).then(() => {
        console.log('Databases and tables created altered in Dev mode');
    }).catch((err) => {
        console.log('Something went wrong with altering tables \n', err);
    });
    // TODO: Use removeHook for before save because it will try to run the hashing twice

    // Seed the tables
    // TODO: This create functions are repititive, hence need to create an ImportDataFromModel functions
    let rider = await db.Rider.bulkCreate(seeds.newRiders).catch((err) => {
        console.log('Failed to seed', err);
    });
    let crashes = await db.Crash.bulkCreate(seeds.newCrashes).catch((err) => {
        console.log('Failed to seed', err);
    });
    let hospitals = await db.Hospital.bulkCreate(seeds.newHospitals).catch((err) => {
        console.log('Failed to seed', err);
    });
    let hospitalAdmins = await db.HospitalAdmin.bulkCreate(seeds.newHospitalAdmins).catch((err) => {
        console.log('Failed to seed', err);
    });
    let polices = await db.Police.bulkCreate(seeds.newPolices).catch((err) => {
        console.log('Failed to seed', err);
    });
    let policeAdmins = await db.PoliceAdmin.bulkCreate(seeds.newPoliceAdmins).catch((err) => {
        console.log('Failed to seed', err);
    });

    // Set the foreign keys
    // Add police admins to police stations
    await polices[0].addPoliceAdmins(policeAdmins.slice(0, 3));
    await polices[1].addPoliceAdmins(policeAdmins[3]);
    await polices[2].addPoliceAdmins(policeAdmins[4]);
    // console.log(await policeAdmins[0].getPolice())

    // Add hospital admins to hospitals
    await hospitals[0].addHospitalAdmins(hospitalAdmins.slice(0, 3));
    await hospitals[1].addHospitalAdmins(hospitalAdmins[3]);
    await hospitals[2].addHospitalAdmins(hospitalAdmins[4]);
    // console.log(await hospitalAdmins[3].getHospital())

    // Add crashes to rider
    await rider[0].addCrashes(crashes.slice(0, 3));
    await rider[1].addCrashes(crashes.slice(3));

    crashes[3].HospitalCrash = {
        status: 'accepted'
    };
    await hospitals[0].addCrashes(crashes[3]);
    await hospitals[3].addCrashes(crashes[4]);

    crashes[3].PoliceCrash = {
        status: 'accepted'
    };
    await polices[0].addCrashes(crashes[3]);
    await polices[3].addCrashes(crashes[4]);
}

async function seedProd() { // Modify the database structure
    await db.sequelize.sync({force: true}).then(() => {
        console.log('Databases and tables created altered in Prod mode');
    }).catch((err) => {
        console.log('Something went wrong with altering tables \n', err);
    });

    // Seed the tables
    let rider = await db.Rider.bulkCreate(seeds.newRiders).catch((err) => {
        console.log('Failed to seed', err);
    });
    let crashes = await db.Crash.bulkCreate(seeds.newCrashes).catch((err) => {
        console.log('Failed to seed', err);
    });
    let hospitals = await db.Hospital.bulkCreate(seeds.newHospitals).catch((err) => {
        console.log('Failed to seed', err);
    });
    let hospitalAdmins = await db.HospitalAdmin.bulkCreate(seeds.newHospitalAdmins).catch((err) => {
        console.log('Failed to seed', err);
    });
    let polices = await db.Police.bulkCreate(seeds.newPolices).catch((err) => {
        console.log('Failed to seed', err);
    });
    let policeAdmins = await db.PoliceAdmin.bulkCreate(seeds.newPoliceAdmins).catch((err) => {
        console.log('Failed to seed', err);
    });

    // Set the foreign keys
    // Add police admins to police stations
    await polices[0].addPoliceAdmins(policeAdmins.slice(0, 3));
    await polices[1].addPoliceAdmins(policeAdmins[3]);
    await polices[2].addPoliceAdmins(policeAdmins[4]);
    // Add hospital admins to hospitals
    await hospitals[0].addHospitalAdmins(hospitalAdmins.slice(0, 3));
    await hospitals[1].addHospitalAdmins(hospitalAdmins[3]);
    await hospitals[2].addHospitalAdmins(hospitalAdmins[4]);
    // Add crashes to rider
    await rider[0].addCrashes(crashes.slice(0, 3));
    await rider[1].addCrashes(crashes.slice(3));

    crashes[3].HospitalCrash = {
        status: 'accepted'
    };
    await hospitals[0].addCrashes(crashes[3]);
    await hospitals[3].addCrashes(crashes[4]);

    crashes[3].PoliceCrash = {
        status: 'accepted'
    };
    await polices[0].addCrashes(crashes[3]);
    await polices[3].addCrashes(crashes[4]);
}

// Seed the database based on the node envionment
if (process.env.NODE_ENV === 'development') {
    console.log('In dev now');
    seedDev().then(() => {
        console.log('Successfully seeded database');
    }).catch((err) => {
        console.log('Failure', err);
    });
} else if (process.env.NODE_ENV === 'production') {
    console.log('In Prod now');
    seedProd().then(() => {
        console.log('Successfully seeded database');
    }).catch((err) => {
        console.log('Failure', err);
    });
} else if (process.env.NODE_ENV === 'test') { // Drop all tables and create them again.
    db.sequelize.sync({force: true}).then(() => {
        console.log('Databases and tables created');
    });
}
