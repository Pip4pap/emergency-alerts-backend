/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let Hospital = sequelize.define(
    'Hospital',
    {
      ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      hospital_Name: {
        type: DataTypes.STRING(200),
        unique: true,
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
      tableName: 'Hospital',
    }
  );

  // Class methods
  Hospital.associate = function (models) {
    Hospital.hasOne(models.HospitalAdmin, {
      foreignKey: 'HospitalID',
    });
  };
  return Hospital;
};
