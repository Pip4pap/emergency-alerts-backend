/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let rider = sequelize.define(
    "rider",
    {
      ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      rider_Name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      next_Of_kin_Name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      next_Of_kin_Contact: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "rider",
    }
  );

  return rider;
};
