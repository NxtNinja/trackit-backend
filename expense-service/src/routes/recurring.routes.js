const express = require("express");
const router = express.Router();

const controller = require("../controllers/recurring.controller");
const validate = require("../middleware/validate.middleware");
const { recurringSchema } = require("../utils/validation");

router.post("/from-transaction/:id", validate(recurringSchema), controller.createFromTransaction);
router.get("/", controller.getUserRecurring);
router.delete("/:id", controller.deleteRecurring);

module.exports = router;
