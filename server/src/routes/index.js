const express = require("express");
const router = express.Router();

router.use("/v1/auth", require("./v1/auth.routes"));
router.use("/v1", require("./v1"));
router.use("/v1/public", require("./v1/public.routes"));
router.use("/v1/feedback", require("./v1/feedback.routes"));

module.exports = router;
