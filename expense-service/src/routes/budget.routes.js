const express = require("express");
const router = express.Router();

const controller = require("../controllers/budget.controller");
const validate = require("../middleware/validate.middleware");
const { budgetSchema, updateBudgetSchema } = require("../utils/validation");

router.post("/createBudget", validate(budgetSchema), controller.createBudget);
router.get("/getBudgets", controller.getBudgets);
router.get("/usage", controller.getBudgetUsage);
router.put("/:id", validate(updateBudgetSchema), controller.updateBudget);
router.delete("/:id", controller.deleteBudget);

module.exports = router;