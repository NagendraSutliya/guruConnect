const express = require("express");
const { requireAdmin } = require("../../../middleware/auth");
const {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} = require("../../../controllers/old/v1/class.controller");

const router = express.Router();

router.post("/", requireAdmin, createClass);
router.get("/", requireAdmin, getClasses);
router.put("/:id", requireAdmin, updateClass);
router.delete("/:id", requireAdmin, deleteClass);

module.exports = router;
