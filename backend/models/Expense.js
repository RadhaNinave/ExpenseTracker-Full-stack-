const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Expense = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,

  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  discription: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Expense;
