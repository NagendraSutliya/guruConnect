const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../../../middleware/auth");
const {
  getPublicLink,
  createPublicLink,
} = require("../../../controllers/admin/PublicLinkController");

router.use(requireAdmin);

router.get("/", getPublicLink);
router.post("/", createPublicLink);

module.exports = router;
