/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "crash",
    {
      ID: {
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
      // TODO: Change this date
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["accepted", "pending", "rejected", "viewing"],
        allowNull: false,
      },
    },
    {
      tableName: "crash",
    }
  );
};
