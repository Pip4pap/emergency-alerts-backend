/* jshint indent: 1 */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('./../utils/appError.js');

module.exports = function (sequelize, DataTypes) {
  let EmergencyAlertsAdmin = sequelize.define(
    'EmergencyAlertsAdmin',
    {
      ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstname: DataTypes.STRING(40),
      lastname: DataTypes.STRING(40),
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'Please provide a valid email' } },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordConfirm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          passwordsMatch: function (passConfirm) {
            if (passConfirm !== this.password) throw new Error('Passwords do not match!');
          },
        },
      },
      role: {
        type: DataTypes.ENUM('EmergencyAlertsAdmin'),
        defaultValue: 'EmergencyAlertsAdmin',
      },
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
    },
    {
      tableName: 'EmergencyAlertsAdmin',
      hooks: {
        beforeBulkCreate: async function (users, options) {
          for (user of users) {
            user.password = await bcrypt.hash(user.password, 12);
            // Delete passwordConfirm field and do not save it to DB
            user.passwordConfirm = '';
          }
        },
        beforeSave: async function (user, options) {
          if (user.changed('password') || user.isNewRecord) {
            user.password = await bcrypt.hash(user.password, 12);
            // Delete passwordConfirm field and do not save it to DB
            user.passwordConfirm = '';
          }
          //Run this only if password has changed
          if (user.changed('password')) {
            this.passwordChangedAt = Date.now() - 1000;
          }
        },
      },
    }
  );

  // class methods
  EmergencyAlertsAdmin.associate = function (models) {};

  EmergencyAlertsAdmin.prototype.isPasswordCorrect = async function (passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.password);
  };

  EmergencyAlertsAdmin.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

  EmergencyAlertsAdmin.prototype.isPasswordChangedAfterTokenIssued = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return jwtTimeStamp < changedTimeStamp;
    }

    //False if password was never changed
    return false;
  };

  return EmergencyAlertsAdmin;
};
