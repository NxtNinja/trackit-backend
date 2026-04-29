const express = require("express");
const router = express.Router();

const controller = require("../controllers/budget.controller");

router.post("/createBudget", controller.createBudget);
router.get("/getBudgets", controller.getBudgets);
router.get("/usage", controller.getBudgetUsage);

module.exports = router;