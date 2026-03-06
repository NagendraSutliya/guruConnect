const router = require("express").Router();
const { adminResults } = require("../../controllers/result.controller");

router.get("/admin", adminResults);

module.exports = router;
