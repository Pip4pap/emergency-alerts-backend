process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { Hospital } = require('./../models/sequelize.js');
const generators = require('./generators.js');
const server = require('./../server.js');

chai.should();
chai.use(chaiHttp);
const client = chai.request.agent(server);

describe('Hospitals', () => {
  beforeEach(async () => {
    await Hospital.destroy({
      truncate: { cascade: true },
    });
  });

  afterEach(async () => {
    await Hospital.destroy({
      truncate: { cascade: true },
    });
  });

  describe('/api/hospital', () => {
    describe('GET /api/hospital', () => {
      it('It should return all the hospitals', async () => {
        const hospital = await Hospital.create(generators.newHospital);

        const requestPromise = new Promise((resolve, reject) => {
          client.get(`/api/hospital/`).then((res) => {
            resolve(res);
          });
        });

        const res = await requestPromise;
        // assertions
        res.should.have.status(200);
        res.body.data[0].should.be.a('object');
        res.body.data[0].should.have.property('ID').eq(`${hospital.ID}`);
        res.body.data[0].should.have.property('hospitalName').eq(`${hospital.hospitalName}`);
        res.body.data[0].should.have.property('hospitalLatitude').eq(`${hospital.hospitalLatitude}`);
        res.body.data[0].should.have.property('hospitalLongitude').eq(`${hospital.hospitalLongitude}`);
      });
    });
    describe('POST /api/hospital', () => {
      it('It should add a hospital', async () => {
        const hospital = generators.newHospital;
        const requestPromise = new Promise((resolve, reject) => {
          client
            .post('/api/hospital')
            .send(generators.newHospital)
            .then((res) => {
              resolve(res);
            });
        });
        const res = await requestPromise;

        //assertions
        res.should.have.status(201);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('ID').eq(`${hospital.ID}`);
        res.body.data.should.have.property('hospitalName').eq(`${hospital.hospitalName}`);
        res.body.data.should.have.property('hospitalLatitude').eq(`${hospital.hospitalLatitude}`);
        res.body.data.should.have.property('hospitalLongitude').eq(`${hospital.hospitalLongitude}`);
      });
    });
  });
  describe('GET /api/hospital/:id', () => {
    it('It should return a hospital with a specified :id', async () => {
      const hospital = await Hospital.create(generators.newHospital);

      const requestPromise = new Promise((resolve, reject) => {
        client.get(`/api/hospital/${hospital.ID}`).then((res) => {
          resolve(res);
        });
      });

      const res = await requestPromise;
      res.should.have.status(200);
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('ID').eq(`${hospital.ID}`);
      res.body.data.should.have.property('hospitalName').eq(`${hospital.hospitalName}`);
      res.body.data.should.have.property('hospitalLatitude').eq(`${hospital.hospitalLatitude}`);
      res.body.data.should.have.property('hospitalLongitude').eq(`${hospital.hospitalLongitude}`);
    });
  });
});
