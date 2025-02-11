
const jwt = require("jsonwebtoken");
const config = require("../../src/config/auth.config.js");

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token provided!",
      data: []
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized!",
        data: []
      });
    }
    req.username = decoded.username;
    req.adminId = decoded.adminId;
    req.userAllowed = decoded.userAllowed;
    req.id = decoded.id;
    next();
  });
  // next();
};


exports.verifyOTPToken = (req, res, next) => {
  let token = req.headers["otp_token"];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No OTP token provided!",
      data: []
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized OTP token!",
        data: []
      });
    }
    req.otp_token_id = decoded.id;
    next();
  });
  // next();
};

exports.verifyForgotPassToken = (req, res, next) => {
  let token = req.headers["forgot_pass_token"];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No OTP token provided!",
      data: []
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized OTP token!",
        data: []
      });
    }
    req.forgot_pass_token_id = decoded.id;
    next();
  });
  // next();
};