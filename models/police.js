/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('police', {
		Police_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Police_Name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Police_Location: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'police'
	});
};
