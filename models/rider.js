/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('rider', {
		Rider_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Rider_Name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Next_Of_kin_Name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Next_Of_kin_Contact: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'rider'
	});
};
