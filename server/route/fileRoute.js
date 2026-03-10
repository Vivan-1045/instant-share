const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  generateLink,
  getFileByLink,
  secureDownload,
} = require("../controller/fileController");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../temp");
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath,{recursive : true});
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

//Generate Link Route
// router.post("/generateLink", upload.array("files"),generateLink);
router.post("/generateLink", (req, res) => {
  upload.array("files")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size exceeds 100MB limit" });
      }
      return res.status(400).json({ error: err.message });
    }

    if (err) {
      return res.status(500).json({ error: "Unexpected upload error" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Total size check
    const totalSize = req.files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      req.files.forEach((f) => fs.unlinkSync(f.path));
      return res
        .status(400)
        .json({ error: "Total file size exceeds 100MB limit" });
    }

    generateLink(req, res);
  });
});

//Handle  Link scan or click
router.get("/:linkId", getFileByLink);

//Handle Encrypted Download
router.post("/secureDownload", secureDownload);

module.exports = router;
