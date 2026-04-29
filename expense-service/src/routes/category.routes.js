const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate.middleware");
const { categorySchema } = require("../utils/validation");

const controller = require("../controllers/category.controller");

router.get("/getCategories", controller.getCategories);
router.post("/createCategory", validate(categorySchema), controller.createCategory);
router.delete("/deleteCategory/:id", controller.deleteCategory);

module.exports = router;