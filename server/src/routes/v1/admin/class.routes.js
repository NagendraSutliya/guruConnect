const express = require("express");
const { requireAdmin } = require("../../../middleware/auth");
const {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} = require("../../../controllers/admin/ClassController");

const router = express.Router();

router.use(requireAdmin);

router.post("/", createClass);
router.get("/", getClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

module.exports = router;
