/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let Crash = sequelize.define(
    'Crash',
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
      placeId: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      // TODO: Change this date
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now,
      },
    },
    {
      tableName: 'Crash',
    }
  );

  // Class methods
  Crash.associate = function (models) {
    Crash.belongsTo(models.Rider, {
      foreignKey: 'riderID',
    });
    Crash.belongsToMany(models.hospital, { through: models.HospitalCrash });
  };

  return Crash;
};
