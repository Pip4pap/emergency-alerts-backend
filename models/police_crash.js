/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    let PoliceCrash = sequelize.define('PoliceCrash', {
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
    }, {tableName: 'PoliceCrash'});

    PoliceCrash.associate = function (models) {};
    return PoliceCrash;
};
