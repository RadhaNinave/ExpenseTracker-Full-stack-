const express = require("express");

const purchaseController = require("../Controllers/purchase");

const authenticatemiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/premiummembership",
  authenticatemiddleware.authUser,
  purchaseController.purchasepremium
);

router.post(
  "/updatetransactionstatus",
  authenticatemiddleware.authUser,
  purchaseController.updateTransactionStatus
);

router.get(
  "/recive",
  authenticatemiddleware.authUser,
  purchaseController.getUser
);

router.get('/downloadexpense',authenticatemiddleware.premiumUser,purchaseController.download);

router.get("/leaderboard",purchaseController.leaderboard);




module.exports = router;
