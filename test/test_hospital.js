process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {Hospital, EmergencyAlertsAdmin, HospitalAdmin} = require('./../models/sequelize.js');
const generators = require('./generators.js');
const server = require('./../server.js');

chai.should();
chai.use(chaiHttp);
const client = chai.request.agent(server);

async function AdminLogin(email, password) {
    return await client.post('/api/admin/login').send({email, password});
}

async function HospitalAdminLogin(email, password) {
    return await client.post('/api/hospitalAdmin/login').send({email, password});
}

describe('Hospitals', () => {
    beforeEach(async () => {
        await Hospital.destroy({
            truncate: {
                cascade: true
            }
        });
        EmergencyAlertsAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
        HospitalAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
    });

    afterEach(async () => {
        await Hospital.destroy({
            truncate: {
                cascade: true
            }
        });
        EmergencyAlertsAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
        HospitalAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
    });

    describe('/api/hospital', () => {
        describe('GET /api/hospital', () => {
            it('It should return all the hospitals', async () => {
                const hospital = await Hospital.create(generators.newHospital);
                await EmergencyAlertsAdmin.create(generators.newAdmin);
                const {email, password} = generators.newAdmin;
                const loginResponse = await AdminLogin(email, password);
                const {token} = loginResponse.body;

                const requestPromise = new Promise((resolve, reject) => {
                    client.get(`/api/hospital/`).set('Authorization', `Bearer ${token}`).then((res) => {
                        resolve(res);
                    });
                });

                const res = await requestPromise;
                // assertions
                res.should.have.status(200);
                res.body.data[0].should.be.a('object');
                res.body.data[0].should.have.property('ID').eq(`${
                    hospital.ID
                }`);
                res.body.data[0].should.have.property('hospitalName').eq(`${
                    hospital.hospitalName
                }`);
                res.body.data[0].should.have.property('hospitalLatitude').eq(`${
                    hospital.hospitalLatitude
                }`);
                res.body.data[0].should.have.property('hospitalLongitude').eq(`${
                    hospital.hospitalLongitude
                }`);
            });
        });
        describe('GET /api/hospital', () => {
            it('It should return forbidden client error with wrong user', async () => {
                const hospital = await Hospital.create(generators.newHospital);
                await HospitalAdmin.create(generators.newHospitalAdmin);
                const {email, password} = generators.newHospitalAdmin;
                const loginResponse = await HospitalAdminLogin(email, password);
                const {token} = loginResponse.body;

                const requestPromise = new Promise((resolve, reject) => {
                    client.get(`/api/hospital/`).set('Authorization', `Bearer ${token}`).then((res) => {
                        resolve(res);
                    });
                });

                const res = await requestPromise;
                // assertions
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eq('fail');
                res.body.should.have.property('message').eq('You do not have permission to perform this action');
            });
        });
        describe('POST /api/hospital', () => {
            it('It should add a hospital', async () => {
                const hospital = generators.newHospital;
                await HospitalAdmin.create(generators.newHospitalAdmin);
                const {email, password} = generators.newHospitalAdmin;
                const loginResponse = await HospitalAdminLogin(email, password);
                const {token} = loginResponse.body;
                const requestPromise = new Promise((resolve, reject) => {
                    client.post('/api/hospital').set('Authorization', `Bearer ${token}`).send(generators.newHospital).then((res) => {
                        resolve(res);
                    });
                });
                const res = await requestPromise;

                // assertions
                res.should.have.status(201);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('ID').eq(`${
                    hospital.ID
                }`);
                res.body.data.should.have.property('hospitalName').eq(`${
                    hospital.hospitalName
                }`);
                res.body.data.should.have.property('hospitalLatitude').eq(`${
                    hospital.hospitalLatitude
                }`);
                res.body.data.should.have.property('hospitalLongitude').eq(`${
                    hospital.hospitalLongitude
                }`);
            });
        });
    });
    describe('GET /api/hospital/:id', () => {
        it('It should return a hospital with a specified :id', async () => {
            const hospital = await Hospital.create(generators.newHospital);
            await EmergencyAlertsAdmin.create(generators.newAdmin);
            const {email, password} = generators.newAdmin;
            const loginResponse = await AdminLogin(email, password);
            const {token} = loginResponse.body;

            const requestPromise = new Promise((resolve, reject) => {
                client.get(`/api/hospital/${
                    hospital.ID
                }`).set('Authorization', `Bearer ${token}`).then((res) => {
                    resolve(res);
                });
            });

            const res = await requestPromise;
            res.should.have.status(200);
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('ID').eq(`${
                hospital.ID
            }`);
            res.body.data.should.have.property('hospitalName').eq(`${
                hospital.hospitalName
            }`);
            res.body.data.should.have.property('hospitalLatitude').eq(`${
                hospital.hospitalLatitude
            }`);
            res.body.data.should.have.property('hospitalLongitude').eq(`${
                hospital.hospitalLongitude
            }`);
        });
    });
});
