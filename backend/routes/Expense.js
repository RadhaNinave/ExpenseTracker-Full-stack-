const express = require("express");
const router = express.Router();
const userController = require("../Controllers/Expense");
const expensesMiddle = require("../middleware/authMiddleware");

router.get("/users", expensesMiddle.authUser, userController.getExpenses);

router.post("/users", expensesMiddle.authUser, userController.postExpenses);

router.delete(
  "/users/:id",
  expensesMiddle.authUser,
  userController.deleteExpense
);

module.exports = router;
