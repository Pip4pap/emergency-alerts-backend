/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('crash', {
		CrashID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Crash_latitude: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Crash_longitude: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Timestamp: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		Rider_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'rider',
				key: 'Rider_ID'
			}
		},
		Hospital_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'hospital',
				key: 'Hospital_ID'
			}
		},
		Status: {
			type: DataTypes.STRING(10),
			allowNull: false
		}
	}, {
		tableName: 'crash'
	});
};
