const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req,file,cb) =>{
      const uploadPath = path.join(__dirname,"temp");
      if(!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath)
      }
      cb(null,uploadPath);
    },
    filename:(req,file,cb) =>{
      const uniqueName = `${Date.now()}-${file.originalname}`
      cb(null,uniqueName)
    }
  }) 
});


let fileTransfers = {};

// API route to generate a shareable link and metadata
app.post("/generateLink", upload.array("files"), (req, res) => {
  const files = req.files; 
  const linkId = uuidv4();
  const expirationTime = Date.now() + 2 * 60 * 1000; 

  // Store metadata for cleanup after expiration
  fileTransfers[linkId] = { 
    files: files.map(f => ({
      path:f.path,
      name:f.originalname
    })),
    expirationTime
  };

  // Set a timer to remove expired data
  setTimeout(() => {
    const data = fileTransfers[linkId]
    if(data){
      data.files.forEach(f=> fs.unlink(f.path,()=>{}));
      delete fileTransfers[linkId];
    }
  }, 2 * 60 * 1000);
  res.json({ linkId, expirationTime });
});

// API route to serve the files when requested via the link
app.get("/:linkId", (req, res) => {
  const linkId = req.params.linkId;
  const fileTransfer = fileTransfers[linkId];

  if (!fileTransfer || Date.now()> fileTransfer.expirationTime) {
    return res.status(400).json({ error: "Link expired or invalid." });
  } 


  //Create the zip of all files
  const archive = archiver("zip",{store:true});
  res.attachment("files.zip")
  archive.pipe(res)

  //Add files to the archive
  fileTransfer.files.forEach(f=>{
    archive.file(f.path,{name:f.name})
  });
  archive.finalize();
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




