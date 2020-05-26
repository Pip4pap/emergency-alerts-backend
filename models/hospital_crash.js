/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "hospital_crash",
    {
      status: {
        type: DataTypes.ENUM,
        values: ["accepted", "pending", "rejected", "viewing"],
        defaultValue: "viewing",
        allowNull: false,
      },
    },
    {
      tableName: "hospital_crash",
    }
  );
};
