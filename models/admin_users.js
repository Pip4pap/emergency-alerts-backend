/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('admin_users', {
		Admin_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Username: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Password: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Hospital_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'hospital',
				key: 'Hospital_ID'
			}
		}
	}, {
		tableName: 'admin_users'
	});
};
