const router = require("express").Router();
const {
  getRoutine,
  saveRoutine,
  deleteRoutine,
} = require("../../controllers/routine.controller");

const { requireAdmin, allowRoles } = require("../../middleware/auth");

router.get("/", allowRoles("admin", "teacher"), getRoutine);
router.post("/", requireAdmin, saveRoutine);
router.delete("/:id", requireAdmin, deleteRoutine);

module.exports = router;
