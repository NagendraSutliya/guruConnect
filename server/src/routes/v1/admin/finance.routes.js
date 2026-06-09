const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../../middleware/auth");
const {
  saveFeeStructure,
  collectFees,
  getInvoices,
} = require("../../../controllers/admin/FinanceController");

router.use(requireAdmin);

router.post("/fee-structure", saveFeeStructure);
router.post("/collect", collectFees);
router.get("/invoices", getInvoices);
router.get("/recent-activity", require("../../../controllers/admin/FinanceController").getRecentActivity);
router.get("/summary/:studentId", require("../../../controllers/admin/FinanceController").getStudentFeeSummary);

module.exports = router;
