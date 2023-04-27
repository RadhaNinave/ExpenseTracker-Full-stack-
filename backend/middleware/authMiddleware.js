const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();


exports.authUser = (req, res, next) => {
  const authToken = req.headers.auth;
  console.log(">>>>>>>>", authToken);
  const user = jwt.verify(authToken,process.env.PASSWORD_SECRET_KEY);
  console.log("userID >>>> ", user.userId);
  User.findByPk(user.userId).then((user) => {
    req.user = user;
    next();
  });
};

exports.premiumUser = (req, res, next) => {
  const authToken = req.headers.auth;
  const user = jwt.verify(authToken,process.env.PASSWORD_SECRET_KEY);
  User.findByPk(user.userId)
    .then((data) => {
      if (data.ispremiumuser) {
        console.log("premium");
        req.user = data;
        next();
      } else {
        res.status(301).json({ msg: "no authorized" });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
