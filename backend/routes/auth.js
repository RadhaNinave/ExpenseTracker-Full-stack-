const express = require("express");
const router = express.Router();
const userController = require("../Controllers/auth");

router.post("/login", userController.loginController);

router.post("/signup", userController.signUpController);

router.post("/forgot", userController.forgotController);

router.get("/resetpassword/:id", userController.resetController);

router.post("/final",userController.finalReset);

module.exports = router;
