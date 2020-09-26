/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let Rider = sequelize.define(
    'Rider',
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
      tableName: 'Rider',
    }
  );

  // Class methods
  Rider.associate = function (models) {
    Rider.hasMany(models.Crash, {
      foreignKey: 'RiderID',
    });
  };
  return Rider;
};
