process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {EmergencyAlertsAdmin} = require('./../models/sequelize.js');
const generators = require('./generators.js');
const server = require('./../server.js');
const requestPromise = require('request-promise');

chai.should();
chai.use(chaiHttp);
const client = chai.request.agent(server);

async function login(email, password) {
    return await client.post('/api/admin/login').send({email, password});
}

describe('Emergency Alerts Platform Admin', () => {
    beforeEach((done) => {
        EmergencyAlertsAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
        done();
    });

    afterEach((done) => {
        EmergencyAlertsAdmin.destroy({
            truncate: {
                cascade: true
            }
        });
        done();
    });

    describe('POST /api/admin/login', () => {
        it('It should successfully login Emergency Alerts Platform Admin with correct credentials', async () => {
            const admin = await EmergencyAlertsAdmin.create(generators.newAdmin);
            const {email, password} = generators.newAdmin;

            const res = await login(email, password);
            // assetions
            res.should.have.status(200);
            res.body.data.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('status').eq('success');
            res.body.data.should.have.property('ID').eq(`${
                admin.ID
            }`);
            res.body.data.should.have.property('email').eq(`${
                admin.email
            }`);
            res.body.data.should.have.property('role').eq(`${
                admin.role
            }`);
        });

        it('It should return unauthorized client error with wrong credentials', async () => {
            const admin = await EmergencyAlertsAdmin.create(generators.newAdmin);
            const {email} = generators.newAdmin;

            const res = await login(email, 'Wrong password');
            // assetions
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eq('fail');
            res.body.should.have.property('message').eq('Incorrect email or password');
        });
    });

    describe('POST /api/admin/signup', () => {
        it('It should successfully add Emergency Alerts Platform Admin to db and log them in', async () => {
            const admin = generators.newAdmin;

            const requestPromise = new Promise((resolve, reject) => {
                client.post('/api/admin/signup').send(generators.newAdmin).then((res) => {
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
                admin.ID
            }`);
            res.body.data.should.have.property('email').eq(`${
                admin.email
            }`);
            res.body.data.should.have.property('role').eq('EmergencyAlertsAdmin');
        });
    });
});
