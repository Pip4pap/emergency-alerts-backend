/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "crash",
    {
      crash_ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      status: {
        type: DataTypes.ENUM,
        values: ["accepted", "pending", "rejected", "viewing"],
        allowNull: false,
      },
      rider_ID: {
        type: DataTypes.UUID,
        references: {
          model: "rider",
          key: "ID",
        },
      },
      hospital_ID: {
        type: DataTypes.UUID,
        references: {
          model: "hospital",
          key: "hospital_ID",
        },
      },
      police_ID: {
        type: DataTypes.UUID,
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
