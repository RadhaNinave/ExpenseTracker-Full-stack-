const sequelize = require("../utils/database");
const Expense = require("../models/Expense");
const User = require("../models/User");
require("dotenv").config();

exports.getExpenses = async (req, res, next) => {
  console.log(req.query.expenseno);
  const ITEMS_PER_PAGE = +req.query.expenseno || 5;
  const page = +req.query.page || 1;
  console.log("page no>>>>>>>>>>>>>>>>>>", +req.query.page);

  let totalExp;
  console.log("req====>", req.user.id);

  const { count, rows } = await Expense.findAndCountAll({
    where: { userId: req.user.id },
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });

  console.log("count======>", count);
  console.log("expenses======>", rows);
  totalExp = count;
  res.status(200).json({
    allExpenses: rows,
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalExp,
    nextPage: page + 1,
    hasPreviousPage: page > 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalExp / ITEMS_PER_PAGE),
  });
};

exports.postExpenses = async (req, res, next) => {
  const tran = await sequelize.transaction();
  try {
    console.log(req.body);
    const category = req.body.category;
    const amount = req.body.amount;
    const discription = req.body.discription;
    await Expense.create(
      {
        category: category,
        amount: amount,
        discription: discription,
        userId: req.user.id,
      },
      {
        transaction: tran,
      }
    );
    User.findByPk(req.user.id, {
      transaction: tran,
    })
      .then((data) => {
        data.total += parseInt(amount);
        data.save();
        tran.commit();
      })
      .catch((err) => {
        tran.rollback();
        console.log(err);
      });

    await res.redirect("/user/users");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    let userId = req.params.id;
    console.log(">>>>>>>>>" + userId);
    await Expense.findByPk(userId).then((data) => {
      console.log("got data from here" + data);
      if (data.dataValues.userId === req.user.id) {
        User.findByPk(req.user.id).then((Userdata) => {
          Userdata.total -= parseInt(data.amount);
          Userdata.save();
        });
      }
    });

    await Expense.destroy({ where: { id: userId } });
    await res.redirect("/user/users");
  } catch (err) {
    console.log(err);
  }
};
