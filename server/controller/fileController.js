const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { encryptBuffer } = require("../utils/encryption");

let fileTransfers = {};

//1.Generate Link Controller
exports.generateLink = (req, res) => {
  const files = req.files;
  const linkId = uuidv4();
  const expirationTime = Date.now() + 2 * 60 * 1000;
  const password = req.body.password || null;

  // Save metadata only
  fileTransfers[linkId] = {
    files: files.map((f) => ({
      filePath: f.path,              
      originalName: f.originalname,  
    })),
    password,
    expirationTime,
  };

  // Auto delete files after 2 minutes
  setTimeout(() => {
    const data = fileTransfers[linkId];
    if (data) {
      data.files.forEach((f) => {
        if (fs.existsSync(f.filePath)) fs.unlinkSync(f.filePath);
      });
      delete fileTransfers[linkId];
    }
  }, 2 * 60 * 1000);

  res.json({ linkId, expirationTime, isEncrypted: !!password });
};

//2.Handle GET request (QR scan or direct link click)
exports.getFileByLink = (req, res) => {
  const linkId = req.params.linkId;
  const fileTransfer = fileTransfers[linkId];

  if (!fileTransfer || Date.now() > fileTransfer.expirationTime) {
    return res.status(400).json({ error: "Link expired or invalid." });
  }

  // If encrypted ask user for password first
  if (fileTransfer.password) {
    return res.json({
      linkId,
      expirationTime: fileTransfer.expirationTime,
      isEncrypted: true,
    });
  }

  res.attachment("files.zip");

  const archive = archiver("zip", { store: true });
  archive.pipe(res);

  fileTransfer.files.forEach((f) => {
    archive.file(f.filePath, { name: f.originalName });
  });

  archive.finalize();
};

//3.Secure Download
exports.secureDownload = (req, res) => {
  const { linkId, password } = req.body;
  const fileTransfer = fileTransfers[linkId];

  if (!fileTransfer || Date.now() > fileTransfer.expirationTime) {
    return res.status(400).json({ error: "Link expired or invalid." });
  }

  if (fileTransfer.password !== password) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  const archive = archiver("zip", { store: true });
  const chunks = [];

  archive.on("data", (chunk) => chunks.push(chunk));

  archive.on("end", () => {
    const zipBuffer = Buffer.concat(chunks);

    // Encrypt final buffer
    const encryptedBuffer = encryptBuffer(zipBuffer, password);

    res.setHeader("Content-Disposition", "attachment; filename=files.enc");
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(encryptedBuffer);
  });

  fileTransfer.files.forEach((f) => {
    archive.file(f.filePath, { name: f.originalName });
  });

  archive.finalize();
};
