const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getStudyMaterials,
  createStudyMaterial,
  deleteStudyMaterial,
} = require("../../controllers/studyMaterial.controller");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF, PNG, JPG allowed"), false);
    }

    cb(null, true);
  },
});

router.get("/", getStudyMaterials);
router.post("/", upload.single("file"), createStudyMaterial);
router.delete("/:id", deleteStudyMaterial);

module.exports = router;
