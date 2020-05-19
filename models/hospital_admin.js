/* jshint indent: 1 */
const bcrypt = require("bcrypt");
const AppError = require("./../utils/appError.js");

module.exports = function (sequelize, DataTypes) {
  let hospitalAdmin = sequelize.define(
    "hospital_admin",
    {
      ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: DataTypes.STRING(40),
      lastname: DataTypes.STRING(40),
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: "Please provide a valid email" } },
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
            if (passConfirm !== this.password)
              throw new Error("Passwords do not match!");
          },
        },
      },
    },
    {
      tableName: "hospital_admin",
      hooks: {
        beforeSave: async function (user, options) {
          if (user.changed("Password") || user.isNewRecord) {
            user.password = await bcrypt.hash(user.password, 12);
            // Delete passwordConfirm field and do not save it to DB
            user.passwordConfirm = "";
          }
        },
      },
    }
  );
  hospitalAdmin.prototype.isPasswordCorrect = async function (passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.password);
  };
  return hospitalAdmin;
};
