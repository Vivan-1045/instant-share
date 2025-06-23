import React, { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

function App() {
  const [files, setFiles] = useState([]);
  const [shareableLink, setShareableLink] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [isLinkExpired, setIsLinkExpired] = useState(false);

  // Handle file selection
  const handleFileSelect = (e) => {
    setFiles([...e.target.files]);
  };

  // Handle API request to generate a shareable link
  const generateShareableLink = async () => {
    if (files.length == 0) {
      alert("Select atleast one file.");
      return;
    }
    try {
      const formData = new FormData();

      // Make sure files are appended correctly
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:9000/generateLink",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { linkId, expirationTime } = response.data;
      setShareableLink(`http://localhost:9000/${linkId}`);
      setExpirationTime(new Date(expirationTime));

      // Check expiration time
      const interval = setInterval(() => {
        if (new Date() > expirationTime) {
          setIsLinkExpired(true);
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };

  return (
    <div>
      <h1>Instant Share the files</h1>

      <div>
        <h2>Select files to send</h2>
        <input type="file" multiple onChange={handleFileSelect} />
        <button onClick={generateShareableLink}>
          Generate Shareable Link & QR Code
        </button>
      </div>

      {shareableLink && (
        <div>
          <h3>Share this link:</h3>
          <a href={shareableLink} target="_blank" rel="noopener noreferrer">
            {shareableLink}
          </a>

          <div>
            <QRCode value={shareableLink} />
          </div>

          {isLinkExpired && (
            <p style={{ color: "red" }}>This link has expired.</p>
          )}
          <p>Link expires at: {expirationTime?.toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}

export default App;
