const express = require("express");
const router = express.Router();

const upload = require("../../middleware/upload");
const examFileController = require("../../controllers/examFile.controller");

// Max 10 files, type-validated via middleware
router.post(
  "/upload-multiple",
  upload.array("files", 10),
  examFileController.uploadMultipleFiles
);

router.post("/save-typed-paper", examFileController.saveTypedPaper);
router.get("/", examFileController.getFiles);
router.delete("/:id", examFileController.deleteFile);

module.exports = router;
