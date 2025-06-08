const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const archiver = require("archiver");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const upload = multer({ storage: multer.memoryStorage() });

let fileTransfers = {};

// API route to generate a shareable link and metadata
app.post("/generateLink", upload.array("files"), (req, res) => {
  const files = req.files; 
  const linkId = uuidv4();
  const expirationTime = Date.now() + 2 * 60 * 1000; 

  // Store file data in-memory
  fileTransfers[linkId] = { files, expirationTime };

  // Set a timer to remove expired data
  setTimeout(() => {
    delete fileTransfers[linkId];
  }, 2 * 60 * 1000);
  res.json({ linkId, expirationTime });
});

// API route to serve the files when requested via the link
app.get("/:linkId", (req, res) => {
  const linkId = req.params.linkId;
  const fileTransfer = fileTransfers[linkId];

  if (fileTransfer && fileTransfer.expirationTime > Date.now()) {
    // Create a zip file with all the files
    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment("files.zip"); // Force download as a zip file

    archive.pipe(res);

    // Add each file to the zip archive
    fileTransfer.files.forEach((file) => {
      archive.append(file.buffer, { name: file.originalname });
    });

    archive.finalize();
  } else {
    res.status(400).json({ error: "Link expired or invalid." });
  }
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




