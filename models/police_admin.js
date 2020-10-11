/* jshint indent: 1 */
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  let PoliceAdmin = sequelize.define(
    'PoliceAdmin',
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
    },
    {
      tableName: 'PoliceAdmin',
      hooks: {
        beforeBulkCreate: async function (users, options) {
          for (user of users) {
            user.password = await bcrypt.hash(user.password, 12);
            // Delete passwordConfirm field and do not save it to DB
            user.passwordConfirm = '';
          }
        },
        beforeSave: async function (user, options) {
          if (user.changed('Password') || user.isNewRecord) {
            user.Password = await bcrypt.hash(user.password, 12);
            // Delete passwordConfirm field and do not save it to DB
            user.passwordConfirm = '';
          }
        },
      },
    }
  );

  // class methods
  PoliceAdmin.associate = function (models) {
    PoliceAdmin.belongsTo(models.Police, {
      foreignKey: 'PoliceID',
    });
  };
  // instance methods
  PoliceAdmin.prototype.isPasswordCorrect = async function (passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.Password);
  };
  return PoliceAdmin;
};
