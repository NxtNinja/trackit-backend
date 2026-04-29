const express = require("express");
const router = express.Router();

const controller = require("../controllers/recurring.controller");

router.post("/from-transaction/:id", controller.createFromTransaction);

module.exports = router;
