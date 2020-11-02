/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    let HospitalCrash = sequelize.define('HospitalCrash', {
        status: {
            type: DataTypes.ENUM,
            values: [
                'accepted', 'pending', 'rejected', 'viewed'
            ],
            defaultValue: 'pending',
            allowNull: false
        },
        distance: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        duration: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {tableName: 'HospitalCrash'});

    HospitalCrash.associate = function (models) {};
    return HospitalCrash;
};
