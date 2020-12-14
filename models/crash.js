/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    let Crash = sequelize.define('Crash', {
        ID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        crashLatitude: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        crashLongitude: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        crashPlaceName: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        crashPlaceID: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now
        },
        hospitalAccepted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        policeAccepted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {tableName: 'Crash'});

    // Class methods
    Crash.associate = function (models) {
        Crash.belongsTo(models.Rider, {foreignKey: 'RiderID'});
        Crash.belongsToMany(models.Hospital, {through: models.HospitalCrash});
        Crash.belongsToMany(models.Police, {through: models.PoliceCrash});
    };

    return Crash;
};
