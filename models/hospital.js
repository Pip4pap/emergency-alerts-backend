/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let hospital = sequelize.define(
    "hospital",
    {
      hospital_ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
