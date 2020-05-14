/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "crash",
    {
      crash_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      crash_latitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      crash_longitude: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      //TODO: make this field enum
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      rider_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "rider",
          key: "rider_ID",
        },
      },
      hospital_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "hospital",
          key: "hospital_ID",
        },
      },
      police_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "police",
          key: "police_ID",
        },
      },
    },
    {
      tableName: "crash",
    }
  );
};
