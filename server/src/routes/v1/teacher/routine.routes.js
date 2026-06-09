const router = require("express").Router();
const { getTeacherRoutine } = require("../../../controllers/admin/RoutineController");
const { requireTeacher } = require("../../../middleware/auth");

router.get("/", requireTeacher, getTeacherRoutine);

module.exports = router;
