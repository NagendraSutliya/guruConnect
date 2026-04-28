const express = require("express");
const router = express.Router();

/* ADMIN */
router.use("/admin", require("./admin"));
router.use("/teacher", require("./teacher"));

module.exports = router;
