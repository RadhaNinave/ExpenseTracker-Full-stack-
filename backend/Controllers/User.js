const User = require("../models/User");

exports.loginController = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findAll({ where: { email } })
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        if (data[0].dataValues.password === password) {
          res.json({ msg: "Login success" });
        } else {
          res.json({ msg: "wrong password" });
        }
      } else {
        res.json({ msg: "wrong email" });
      }
    })
    .catch((e) => {
      console.log(e, "error");
    });
};

exports.signUpController = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  User.create({
    email: email,
    password: password,
  })
    .then((data) => {
      res.json({ email: email, status: "success" });
    })
    .catch((e) => {
      User.findAll({ where: { email: email } })
        .then((data) => {
          res.status(301);
          res.json({ email: email, status: "fail" });
        })
        .catch((e) => console.log(e));
    });
};
