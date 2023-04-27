const express = require("express");
const router = express.Router();
const userController = require("../Controllers/auth");

router.post("/login", userController.loginController);

router.post("/signup", userController.signUpController);

module.exports = router;
