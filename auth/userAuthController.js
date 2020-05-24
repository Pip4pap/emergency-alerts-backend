const crypto = require("crypto"); //package will be used if we be used to create encrypted text for example password reset tokens
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");
const { Hospital } = require("./../models/sequelize");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.admin_id);
  //set the HttpOnly cookie
  const cookieOptions = {
    expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60000),
    HttpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  //   user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

class userControllerAuth {
  constructor(User) {
    this.User = User;
  }

  signup() {
    return catchAsync(async (req, res, next) => {
      const user = await this.User.create(req.body);

      createSendToken(user, 201, res);
    });
  }
  login() {
    return catchAsync(async (req, res, next) => {
      const { email, password } = req.body;
      //1 Check if the credentials are provided
      if (!(email || password))
        return next(new AppError("Please provide an email or password", 400));

      //2 Check if the user exists in db
      const user = await this.User.findOne({
        where: { email },
        include: [{ model: Hospital }],
      });

      if (!user || !(await user.isPasswordCorrect(password)))
        return next(new AppError("Incorrect email or password", 401));
      createSendToken(user, 200, res);
    });
  }
  logout() {
    return (req, res) => {
      res.cookie("jwt", "no-auth", {
        expires: new Date(Date.now() + 10 * 1000),
        HttpOnly: true,
      });
      res.status(200).json({ status: "success" });
    };
  }
}

module.exports = userControllerAuth;
