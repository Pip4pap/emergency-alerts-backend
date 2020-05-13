/* jshint indent: 1 */

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
        validate: { isEmail: { msg: "Please provide a valid email" } },
      },
      Password: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      passwordConfirm: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
          passwordsMatch: function (passConfirm) {
            if (passConfirm === this.password)
              throw new Error("Passwords do not match!");
          },
        },
      },
      Hospital_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "hospital",
          key: "Hospital_ID",
        },
      },
    },
    {
      tableName: "hospital_admin",
    }
  );

  return hospitalAdmin;
};
