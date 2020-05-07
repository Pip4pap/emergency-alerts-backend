/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('admin', {
		Username: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		Password: {
			type: DataTypes.STRING(20),
			allowNull: false
		}
	}, {
		tableName: 'admin'
	});
};
