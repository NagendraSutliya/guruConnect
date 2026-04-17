const express = require("express");
const router = express.Router();

/* ADMIN */
router.use("/admin", require("./admin"));

module.exports = router;
