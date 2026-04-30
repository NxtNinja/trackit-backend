const express = require("express");
const router = express.Router();

const controller = require("../controllers/budget.controller");
const validate = require("../middleware/validate.middleware");
const { budgetSchema } = require("../utils/validation");

router.post("/createBudget", validate(budgetSchema), controller.createBudget);
router.get("/getBudgets", controller.getBudgets);
router.get("/usage", controller.getBudgetUsage);
router.put("/:id", validate(budgetSchema), controller.updateBudget);
router.delete("/:id", controller.deleteBudget);

module.exports = router;