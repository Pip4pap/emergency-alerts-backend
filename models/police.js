/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let police = sequelize.define(
    "police",
    {
      police_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      police_Name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      police_latitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      police_longitude: {
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
