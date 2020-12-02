/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    let Hospital = sequelize.define('Hospital', {
        ID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        hospitalName: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: false
        },
        hospitalLatitude: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        hospitalLongitude: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        hospitalPlaceID: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {tableName: 'Hospital'});

    // Class methods
    Hospital.associate = function (models) {
        Hospital.hasMany(models.HospitalAdmin, {foreignKey: 'HospitalID'});
        Hospital.belongsToMany(models.Crash, {through: models.HospitalCrash});
    };
    return Hospital;
};
