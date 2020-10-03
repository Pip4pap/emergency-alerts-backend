'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + './../config/config.json')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);
//  Use the models already existing in the app.
fs.readdirSync(__dirname + './../../models')
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file !== 'sequelize.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname + './../../models', file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
