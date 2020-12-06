/* jshint indent: 1 */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('./../utils/appError.js');

module.exports = function (sequelize, DataTypes) {
    let PoliceAdmin = sequelize.define('PoliceAdmin', {
        ID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        firstname: DataTypes.STRING(40),
        lastname: DataTypes.STRING(40),
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Please provide a valid email'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordConfirm: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                passwordsMatch: function (passConfirm) {
                    if (passConfirm !== this.password) {
                        throw new Error('Passwords do not match!');
                    }
                }
            }
        },
        role: {
            type: DataTypes.ENUM('PoliceAdmin'),
            defaultValue: 'PoliceAdmin'
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationStatus: {
            type: DataTypes.ENUM('Approved', 'Pending', 'Denied'),
            defaultValue: 'Pending'
        },
        passwordChangedAt: DataTypes.DATE,
        passwordResetToken: DataTypes.STRING,
        passwordResetExpires: DataTypes.DATE
    }, {
        tableName: 'PoliceAdmin',
        hooks: {
            beforeBulkCreate: async function (users, options) {
                for (user of users) {
                    user.password = await bcrypt.hash(user.password, 12);
                    // Delete passwordConfirm field and do not save it to DB
                    user.passwordConfirm = '';
                }
            },
            afterValidate: async function (user, options) { // Run this only if password has changed
                if (user.changed('password') || user.isNewRecord) {
                    user.password = await bcrypt.hash(user.password, 12);
                    // Delete passwordConfirm field and do not save it to DB
                    user.passwordConfirm = '';
                    user.passwordChangedAt = Date.now();
                }
            }
        }
    });

    // class methods
    // Using "as" to associate PoliceAdmin model to Police model because of Sequelize changing Police model name to Polouse
    PoliceAdmin.associate = function (models) {
        PoliceAdmin.belongsTo(models.Police, {
            as: 'Police',
            foreignKey: "PoliceID"
        });
    };

    PoliceAdmin.prototype.isPasswordCorrect = async function (passwordToCheck) {
        return await bcrypt.compare(passwordToCheck, this.password);
    };

    PoliceAdmin.prototype.createPasswordResetToken = function () {
        const resetToken = crypto.randomBytes(32).toString('hex');

        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        return resetToken;
    };

    PoliceAdmin.prototype.isPasswordChangedAfterTokenIssued = function (jwtTimeStamp) {
        if (this.passwordChangedAt) {
            const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
            return jwtTimeStamp < changedTimeStamp;
        }

        // False if password was never changed
        return false;
    };

    return PoliceAdmin;
};
