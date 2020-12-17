const crypto = require('crypto'); // package will be used if we be used to create encrypted text for example password reset tokens
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('./../utils/appError.js');
const catchAsync = require('./../utils/catchAsync');
const sendForgotPasswordEmail = require('../utils/email.js');

const signToken = (id, tableName) => {
    return jwt.sign({
        id,
        tableName
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER
    });
};

const createSendToken = (user, tableName, statusCode, res) => {
    const token = signToken(user.ID, tableName);
    // set the HttpOnly cookie
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60000),
        HttpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    // user.password = undefined;

    res.status(statusCode).json({status: 'success', token, data: user});
};

class userControllerAuth {
    constructor(User) {
        this.User = User;
        this.UserTableName = User.getTableName();
    }

    signup() {
        return catchAsync(async (req, res, next) => {
            const user = await this.User.create(req.body);

            createSendToken(user, this.UserTableName, 201, res);
        });
    }

    login() {
        return catchAsync(async (req, res, next) => {
            const {email, password} = req.body;
            // 1 Check if the credentials are provided
            if (!(email || password)) 
                return next(new AppError('Please provide an email or password', 400));
            

            // 2 Check if the user exists in db
            const user = await this.User.findOne({where: {
                    email
                }});

            if (! user || !(await user.isPasswordCorrect(password))) 
                return next(new AppError('Incorrect email or password', 401));
            

            createSendToken(user, this.UserTableName, 200, res);
        });
    }
    restrictTo(...roles) {
        return(req, res, next) => { // roles ['HospitalAdmin', 'EmergencyAlertsAdmin', 'PoliceAdmin']
            if (!roles.includes(req.user.role)) {
                return next(new AppError('You do not have permission to perform this action', 403));
            }
            next();
        };
    }

    forgotPassword() {
        return catchAsync(async (req, res, next) => { // Step1: Get the user posted email
            const user = await this.User.findOne({
                where: {
                    email: req.body.email
                }
            });
            if (! user) {
                return next(new AppError('There is no user with such an email address', 404));
            }

            // Step2: Generate a random reset token
            const resetToken = user.createPasswordResetToken();
            await user.save();

            // Step3: Send it to the users email
            const resetURL = `${
                req.protocol
            }://${
                req.get('Host')
            }/api/${
                user.role
            }/resetPassword?token=${resetToken}`;

            const message = `Hello Philip
      \nForgot your password? Click here to reset it: ${resetURL}
      \n (Note) This is the reset URL is for the backend and its not the one supposed to be sent to the users email. It should be
      used only to update the password at the backend. I request that you send me a valid link to the front end interface where the user will be able
      to update their password. Then use the reset URL to update the password. I have included it in the response of the forgot password route.
      \nIf you didn't forget your password, please ignore this email!`;

            try {
                await sendForgotPasswordEmail({email: user.email, subject: 'Your password reset token is valid for 10 min', message});

                res.status(200).json({status: 'success', message: 'Token sent to email', data: {
                        resetURL
                    }});
            } catch (err) {
                user.passwordResetToken = null;
                user.passwordResetExpires = null;
                await user.save();

                return next(new AppError('There was an error sending the email. Try again later!', 500));
            }
        });
    }

    resetPassword() {
        return catchAsync(async (req, res, next) => { // Step1: Get the user based on token
            let hashToken = crypto.createHash('sha256').update(req.query.token).digest('hex');

            const user = await this.User.findOne({
                where: {
                    passwordResetToken: hashToken,
                    passwordResetExpires: {
                        [Op.gt]: Date.now()
                    }
                }
            });

            // Step2: Check if user exists
            if (! user) {
                return next(new AppError('Token invalid or has expired', 400));
            }
            // Step3: Change the user's passwo
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.passwordChangedAt = Date.now();
            user.passwordResetExpires = null;
            user.passwordResetToken = null;
            // console.log(user.password);
            await user.save();

            // Log the user in, send JWT
            createSendToken(user, this.UserTableName, 200, res);
        });
    }

    updatePassword() {
        return catchAsync(async (req, res, next) => { // Step1: Get the user
            const user = this.User.findOne({
                where: {
                    ID: req.user.ID
                },
                attributes: ['password']
            });

            // Step2: Check if the posted passwords match
            if (! user.isPasswordCorrect(user.password)) {
                return next(new AppError('Your current password is wrong', 401));
            }

            // Step3 Update the password
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            await user.save();

            // Step4: Login User again, Send JWT
            createSendToken(user, this.UserTableName, 200, res);
        });
    }

    logout() {
        return(req, res) => {
            res.cookie('jwt', 'no-auth', {
                expires: new Date(Date.now() + 10 * 1000),
                HttpOnly: true
            });
            res.status(200).json({status: 'success'});
        };
    }
}

module.exports = userControllerAuth;
