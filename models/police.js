/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    let Police = sequelize.define('Police', {
        ID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        policeName: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: false
        },
        policeLatitude: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        policeLongitude: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        policePlaceID: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {tableName: 'Police'});

    // Class methods
    Police.associate = function (models) {
        Police.hasMany(models.PoliceAdmin, {foreignKey: 'PoliceID'});
        Police.belongsToMany(models.Crash, {
            through: models.PoliceCrash,
            foreignKey: "PoliceID"
        });
    };
    return Police;
};
