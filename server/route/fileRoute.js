const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { generateLink, getFileByLink, secureDownload } = require("../controller/fileController");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../temp");
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  })
});

//Generate Link Route 
router.post("/generateLink", upload.array("files"),generateLink);

//Handle  Link scan or click
router.get("/:linkId",getFileByLink);

//Handle Encrypted Download
router.post("/secureDownload",secureDownload);

module.exports = router;
