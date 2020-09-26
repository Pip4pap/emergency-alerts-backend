/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  let HospitalCrash = sequelize.define(
    'HospitalCrash',
    {
      status: {
        type: DataTypes.ENUM,
        values: ['accepted', 'pending', 'rejected', 'viewing'],
        defaultValue: 'viewing',
        allowNull: false,
      },
    },
    {
      tableName: 'HospitalCrash',
    }
  );

  HospitalCrash.associate = function (models) {};
  return HospitalCrash;
};
