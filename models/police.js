/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let police = sequelize.define(
    "police",
    {
      police_ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      police_Name: {
        type: DataTypes.STRING(200),
        unique: true,
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
