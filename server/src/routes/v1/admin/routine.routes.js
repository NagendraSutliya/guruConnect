const router = require("express").Router();
const {
  getRoutine,
  saveRoutine,
  updateRoutine,
  deleteRoutine,
  clearRoutine,
  copyRoutine,
} = require("../../../controllers/admin/RoutineController");

const { requireAdmin, allowRoles } = require("../../../middleware/auth");

router.get("/", allowRoles("admin", "teacher"), getRoutine);
router.post("/", requireAdmin, saveRoutine);
router.post("/copy", requireAdmin, copyRoutine);
router.delete("/bulk", requireAdmin, clearRoutine);
router.put("/:id", requireAdmin, updateRoutine);
router.delete("/:id", requireAdmin, deleteRoutine);

module.exports = router;
