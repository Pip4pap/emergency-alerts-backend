/* jshint indent: 1 */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('./../utils/appError.js');

module.exports = function (sequelize, DataTypes) {
  let HospitalAdmin = sequelize.define(
    'HospitalAdmin',
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
        type: DataTypes.STRING(245),
        allowNull: false,
      },
      passwordConfirm: {
        type: DataTypes.STRING(245),
        allowNull: false,
        validate: {
          passwordsMatch: function (passConfirm) {
            if (passConfirm !== this.password) throw new Error('Passwords do not match!');
          },
        },
      },
      role: {
        type: DataTypes.ENUM('HospitalAdmin'),
        defaultValue: 'HospitalAdmin',
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationStatus: {
        type: DataTypes.ENUM('Approved', 'Pending', 'Denied'),
        defaultValue: 'Pending',
      },
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
    },
    {
      tableName: 'HospitalAdmin',
      hooks: {
        beforeBulkCreate: async function (users, options) {
          for (user of users) {
            user.password = await bcrypt.hash(user.password, 12);
            // Delete passwordConfirm field and do not save it to DB
            user.passwordConfirm = '';
          }
        },
        afterValidate: async function (user, options) {
          if (user.changed('password') || user.isNewRecord) {
            // Delete passwordConfirm field and do not save it to DB
            // TODO: This runs all the time we save or create anything in db, It affects password reset functionality
            // Will try to set Validation: false on routes that are not changing passwords
            user.passwordConfirm = '';
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        // afterSave: async function (user, options) {
        //   //Run this only if password has changed
        //   console.log('Before Save');
        //   console.log(user.changed('password'));
        //   if (user.changed('password') || user.isNewRecord) {
        //     user.password = await bcrypt.hash(user.password, 12);
        //     // Delete passwordConfirm field and do not save it to DB
        //     user.passwordConfirm = '';
        //     user.passwordChangedAt = Date.now();
        //   }
        // },
      },
    }
  );

  // class methods
  HospitalAdmin.associate = function (models) {
    HospitalAdmin.belongsTo(models.Hospital, {
      foreignKey: 'HospitalID',
    });
  };

  HospitalAdmin.prototype.isPasswordCorrect = async function (passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.password);
  };

  HospitalAdmin.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

  HospitalAdmin.prototype.isPasswordChangedAfterTokenIssued = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return jwtTimeStamp < changedTimeStamp;
    }

    //False if password was never changed
    return false;
  };

  return HospitalAdmin;
};
