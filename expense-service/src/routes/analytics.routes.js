const express = require("express");
const router = express.Router();

const controller = require("../controllers/analytics.controller");

router.get("/summary", controller.getSummary);
router.get("/category-wise", controller.getCategoryWise);
router.get("/monthly", controller.getMonthlyTrends);

module.exports = router;
