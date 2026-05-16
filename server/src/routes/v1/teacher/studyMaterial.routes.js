const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getStudyMaterials,
  createStudyMaterial,
  deleteStudyMaterial,
} = require("../../../controllers/teacher/StudyMaterialController");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // accept generic documents for study material
    const allowedMimeTypes = [
       "application/pdf", 
       "image/png", 
       "image/jpeg", 
       "application/msword", 
       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
       "application/zip",
       "application/x-zip-compressed",
       "application/vnd.ms-excel",
       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
       "text/plain"
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype) && !file.originalname.match(/\.(pdf|doc|docx|zip|xls|xlsx|txt|png|jpg|jpeg)$/i)) {
      return cb(new Error("File format not supported. Please upload documents or images."), false);
    }
    cb(null, true);
  },
});

router.get("/", getStudyMaterials);
router.post("/", upload.single("file"), createStudyMaterial);
router.delete("/:id", deleteStudyMaterial);

module.exports = router;
