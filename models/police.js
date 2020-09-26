/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let Police = sequelize.define(
    'Police',
    {
      ID: {
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
      tableName: 'Police',
    }
  );
  // class methods

  Police.associate = function (models) {
    Police.hasOne(models.PoliceAdmin, {
      foreignKey: 'PoliceID',
    });
  };
  return Police;
};
