const express = require("express");
const router = express.Router();
const AdmissionController = require("../../../controllers/admin/AdmissionController");
const { requireAdmin } = require("../../../middleware/auth");

router.use(requireAdmin);

router.post("/", AdmissionController.createAdmission);
router.get("/", AdmissionController.getAdmissions);
router.patch("/:id/confirm", AdmissionController.confirmAdmission);
router.patch("/:id/stage", AdmissionController.updateAdmissionStage);
router.put("/:id", AdmissionController.updateAdmissionDetails);
router.patch("/:id", AdmissionController.updateAdmissionDetails);
router.delete("/:id", AdmissionController.deleteAdmission);

module.exports = router;
