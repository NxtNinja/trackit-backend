const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate.middleware");
const { transactionSchema } = require("../utils/validation");

const controller = require("../controllers/transaction.controller");

router.post(
  "/addTransaction",
  validate(transactionSchema),
  controller.addTransaction,
);
router.get("/getAllTransactions", controller.getTransactions);
router.put(
  "/updateTransaction/:id",
  validate(transactionSchema),
  controller.updateTransaction,
);
router.delete("/deleteTransaction/:id", controller.deleteTransaction);

module.exports = router;
