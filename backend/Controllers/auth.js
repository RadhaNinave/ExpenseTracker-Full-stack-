const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/forgotPassword");
const { v4 } = require("uuid");

require("dotenv").config();

const client = Sib.ApiClient.instance;
const apikey = client.authentications["api-key"];
apikey.apiKey =process.env.API_KEY;

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser },
    process.env.PASSWORD_SECRET_KEY
  );
};

exports.loginController = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = await User.findAll({ where: { email } });
    console.log(data);
    if (data.length > 0) {
      const result = await bcrypt.compare(
        password,
        data[0].password,
        (err, result) => {
          if (result) {
            const token = generateAccessToken(
              data[0].id,
              data[0].name,
              data[0].ispremiumuser
            );
            res.status(200).json({
              msg: "Login Success",
              name: data[0].dataValues.name,
              token,
            });
          } else {
            res.status(301).json({ msg: "Wrong Password" });
          }
        }
      );
      console.log(data);
    } else {
      res.status(401);
      res.json({ msg: "wrong email" });
    }
  } catch (e) {
    console.log(e, "error");
  }
};

exports.signUpController = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const saltrounds = 10;
    await bcrypt.hash(password, saltrounds, (err, hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((data) => {
          res.json({ data, status: "success" });
        })
        .catch((e) => {
          User.findAll({ where: { email: email } })
            .then((data) => {
              res
                .status(301)
                .json({ email: email, status: "email already exists" });
            })
            .catch((e) => {
              console.log(e);
            });
        });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.forgotController = (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const id = v4();
  console.log(id);
  User.findAll({ where: { email }, attributes: ["id"] })
    .then((data) => {
      const jsonData = JSON.parse(JSON.stringify(data));
      if (jsonData.length > 0) {
        return ForgotPasswordRequest.create({
          id,
          isActive: true,
          userId: jsonData[0].id,
        });
      } else {
        res.json({ status: "email not found" });
      }
    })
    .then((data) => {
      const sender = {
        name: "Reset Password",
        email: "alibaba@expense.com",
      };
      const recivers = [
        {
          email: email,
        },
      ];
      return tranEmailApi.sendTransacEmail({
        sender,
        to: recivers,
        subject: "Reset Password",
        textContent: "Reset Your Password",
        htmlContent: `<a href=http://localhost:5000/auth/resetpassword/${id} > Reset Link </a>`,
      });
    })
    .then((data) => {
      console.log(data);
      res.status(200).json({ status: "done" });
    })
    .catch((e) => {
      console.log(e);
      res.json({ status: "error" });
    });
};

exports.resetController = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const data = await ForgotPasswordRequest.findByPk(req.params.id);
    console.log(data);
    if (data.isActive) {
      data.isActive = false;
      data.save();
      res.send(`
    <form action='http://localhost:5000/auth/final' method='POST'>
      <input name='password' placeholder='enter new password'/>
      <input type="hidden" name="id" value=${data.userId} />
      <button type='submit'>Submit</button>
    </form>`);
    } else {
      res.send("<h1>Link Exprire</h1>");
    }
  } catch (e) {
    console.log(e);
    res.send("<h1>Link Exprire</h1>");
    console.log(e);
  }
};

exports.finalReset = (req, res, next) => {
  const { password, id } = req.body;

  bcrypt.hash(password, 8, (err, hash) => {
    User.findByPk(id)
      .then((data) => {
        data.password = hash;
        data.save();
        res.send("<h3>Password Has Been Reset!</h3><h3>Login again</h3> ");
      })
      .catch((e) => console.log(e));
  });
};
