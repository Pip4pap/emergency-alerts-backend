const crypto = require("crypto"); //package will be used if we be used to create encrypted text for example password reset tokens
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");

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
      if (user) console.log("User has been created", user.ID);
      createSendToken(user, 201, res);
    });
  }
  login() {}
}

module.exports = userControllerAuth;
