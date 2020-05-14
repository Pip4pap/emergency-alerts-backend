/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let hospital = sequelize.define(
    "hospital",
    {
      hospital_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      hospital_Name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      hospital_latitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      hospital_longitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "hospital",
    }
  );

  return hospital;
};
