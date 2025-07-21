const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

const { encryptBuffer} = require("./encrypt/encryption.js");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "temp");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

let fileTransfers = {};

// API route to generate a shareable link and metadata
app.post("/generateLink", upload.array("files"), (req, res) => {
  const files = req.files;
  const linkId = uuidv4();
  const expirationTime = Date.now() + 2 * 60 * 1000;
  const password = req.body.password || null;

  // Store only file metadata, not zip
  fileTransfers[linkId] = {
    files: files.map((f) => ({
      path: f.path,
      name: f.originalname,
    })),
    password,
    expirationTime,
  };

  // Cleanup
  setTimeout(() => {
    const data = fileTransfers[linkId];
    if (data) {
      data.files.forEach((f) => fs.unlink(f.path, () => {}));
      delete fileTransfers[linkId];
    }
  }, 2 * 60 * 1000);

  res.json({ linkId, expirationTime, isEncrypted: !!password });
});

// API route to handle request when any user scan the qr or click the link
app.get("/:linkId", (req, res) => {
  const linkId = req.params.linkId;
  const fileTransfer = fileTransfers[linkId];

  if (!fileTransfer || Date.now() > fileTransfer.expirationTime) {
    return res.status(400).json({ error: "Link expired or invalid." });
  }

  if (fileTransfer.password) {
    return res.json({
      linkId,
      expirationTime: fileTransfer.expirationTime,
      isEncrypted: true,
    });
  }

  // Stream files as zip directly (no disk storage of zip)
  res.attachment("files.zip");
  const archive = archiver("zip", { store: true });
  archive.pipe(res);

  fileTransfer.files.forEach((f) => {
    archive.file(f.path, { name: f.name });
  });

  archive.finalize();
});

app.post("/secureDownload", (req, res) => {
  const { linkId, password } = req.body;
  const fileTransfer = fileTransfers[linkId];

  if (!fileTransfer || Date.now() > fileTransfer.expirationTime) {
    return res.status(400).json({ error: "Link expired or invalid." });
  }

  if (fileTransfer.password !== password) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  // Stream zip, then encrypt, then send to client
  const archive = archiver("zip", { store: true });
  const chunks = [];

  archive.on("data", (chunk) => chunks.push(chunk));

  archive.on("end", () => {
    const zipBuffer = Buffer.concat(chunks);

    // Encrypt the zip buffer before sending
    const encryptedBuffer = encryptBuffer(zipBuffer, password);

    res.setHeader("Content-Disposition", "attachment; filename=files.zip");
    res.send(encryptedBuffer);
  });

  fileTransfer.files.forEach((f) => {
    archive.file(f.path, { name: f.name });
  });

  archive.finalize();
});



// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
