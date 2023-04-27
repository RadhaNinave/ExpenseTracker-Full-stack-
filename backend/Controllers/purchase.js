const Razorpay = require("razorpay");
const Order = require("../models/orders");

const express = require("express");
const router = express.Router();
require("dotenv").config();

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const AWS = require("aws-sdk");

const Expense = require("../models/Expense");

router.use(bodyParser.json());

function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Somethin went wrong", err);
        reject(err);
      } else {
        console.log("SUCESS", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    const amount = 3000;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser },
    process.env.PASSWORD_SECRET_KEY
  );
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    console.log(userName);
    const { payment_id, order_id } = req.body;
    console.log("payment_id=====>", payment_id);
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: generateAccessToken(userId, userName, true),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Sometghing went wrong" });
  }
};

exports.getUser = (req, res, next) => {
  User.findByPk(req.user.id)
    .then((data) => {
      res.json({ status: data.dataValues.ispremiumuser });
    })
    .catch((e) => console.log(e));
};

exports.leaderboard = (req, res, next) => {
  // Expense.findAll({
  //   attributes: [[Sequelize.fn("sum", Sequelize.col("amount")), "total"]],
  //   group: ["userId"],
  //   include: [{ model: User, attributes: ["name"] }],
  // })

  User.findAll({
    attributes: ["name", "total"],
  })
    .then((data) => {
      const jsonData = JSON.parse(JSON.stringify(data));

      jsonData.sort((a, b) => b.total - a.total);
      console.log(jsonData);
      res.json(jsonData);
    })
    .catch((e) => console.log(e));
};

exports.download = async (req, res, next) => {
  console.log("i am called");
  const data = await Expense.findAll({
    where: { userID: req.user.id },
    attributes: ["discription", "amount", "category"],
  });
  const stringfiedExpenses = JSON.stringify(data);
  const userId = req.user.id;
  const filename = `Expense${userId}/${new Date()}.txt`;
  const fileURL = await uploadToS3(stringfiedExpenses, filename);
  res.status(200).json({ fileURL, sucess: true });
};
