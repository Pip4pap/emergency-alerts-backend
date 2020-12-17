process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {Hospital, HospitalAdmin} = require('./../models/sequelize.js');
const generators = require('./generators.js');
const server = require('./../server.js');
const requestPromise = require('request-promise');

chai.should();
chai.use(chaiHttp);
const client = chai.request.agent(server);

async function login(email, password) {
    return await client.post('/api/hospitalAdmin/login').send({email, password});
}

describe('Hospital Admin', () => {
    beforeEach((done) => {
        Hospital.destroy({
            truncate: {
                cascade: true
            }
        });
        HospitalAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
        done();
    });

    afterEach((done) => {
        Hospital.destroy({
            truncate: {
                cascade: true
            }
        });
        HospitalAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
        done();
    });

    describe('POST /api/hospitalAdmin/login', () => {
        it('It should successfully login HospitalAdmin with correct credentials', async () => {
            const hospitalAdmin = await HospitalAdmin.create(generators.newHospitalAdmin);
            const {email, password} = generators.newHospitalAdmin;

            const res = await login(email, password);
            // assetions
            res.should.have.status(200);
            res.body.data.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('status').eq('success');
            res.body.data.should.have.property('ID').eq(`${
                hospitalAdmin.ID
            }`);
            res.body.data.should.have.property('email').eq(`${
                hospitalAdmin.email
            }`);
            res.body.data.should.have.property('role').eq(`${
                hospitalAdmin.role
            }`);
        });

        it('It should return unauthorized client error with wrong credentials', async () => {
            const hospitalAdmin = await HospitalAdmin.create(generators.newHospitalAdmin);
            const {email} = generators.newHospitalAdmin;

            const res = await login(email, 'Wrong password');
            // assetions
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eq('fail');
            res.body.should.have.property('message').eq('Incorrect email or password');
        });
    });

    describe('POST /api/hospitalAdmin/signup', () => {
        it('It should successfully add HospitalAdmin to db and Log them in', async () => {
            const hospitalAdmin = generators.newHospitalAdmin;

            const requestPromise = new Promise((resolve, reject) => {
                client.post('/api/hospitalAdmin/signup').send(generators.newHospitalAdmin).then((res) => {
                    resolve(res);
                });
            });
            const res = await requestPromise;
            // assetions
            res.should.have.status(201);
            res.body.data.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('status').eq('success');
            res.body.data.should.have.property('ID').eq(`${
                hospitalAdmin.ID
            }`);
            res.body.data.should.have.property('email').eq(`${
                hospitalAdmin.email
            }`);
            res.body.data.should.have.property('role').eq('HospitalAdmin');
        });
    });
    describe('/api/hospitalAdmin/hospital', () => {
        describe('GET /api/hospitalAdmin/hospital', () => {
            it("It should return the HospitalAdmin's hospital", async () => {
                const hospital = await Hospital.create(generators.newHospital);
                const hospitalAdmin = await HospitalAdmin.create(generators.newHospitalAdmin);
                await hospital.setHospitalAdmins(hospitalAdmin);

                const {email, password} = generators.newHospitalAdmin;
                const loginResponse = await login(email, password);
                const {token} = loginResponse.body;

                const requestPromise = new Promise((resolve, reject) => {
                    client.get("/api/hospitalAdmin/hospital").set('Authorization', `Bearer ${token}`).then((res) => {
                        resolve(res);
                    });
                });

                const res = await requestPromise;
                // assertions
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.request.header.should.have.property('Authorization');
                res.body.data.should.have.property('hospitalName').eq(generators.newHospital.hospitalName);
            });
        });
        describe('POST /api/hospitalAdmin/:id/hospital', () => {});
    });
});
