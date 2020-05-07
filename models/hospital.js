/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('hospital', {
		Hospital_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Hospital_Name: {
			type: DataTypes.STRING(200),
			allowNull: false
		},
		Hospital_latitude: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Hospital_longitude: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'hospital'
	});
};
