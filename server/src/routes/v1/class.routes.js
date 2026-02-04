const express = require("express");
const { requireAdmin } = require("../../middleware/auth");
const {
  createClass,
  getClasses,
} = require("../../controllers/class.controller");

const router = express.Router();

router.post("/", requireAdmin, createClass);
router.get("/", requireAdmin, getClasses);

module.exports = router;
