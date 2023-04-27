const DB = require("../utils/database");

const Sequelize = require("sequelize");

const ForgotPasswordRequest = DB.define("forgotpasswords", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = ForgotPasswordRequest;
