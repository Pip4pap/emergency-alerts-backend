/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let police = sequelize.define(
    "police",
    {
      Police_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Police_Name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Police_latitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Police_longitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "police",
    }
  );

  return police;
};
