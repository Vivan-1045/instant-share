import {useUrlShortener} from "./ShortUrl"
import React, { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import "../styles/styles.css";

function App() {
  const [files, setFiles] = useState([]);
  const [shareableLink, setShareableLink] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [isLinkExpired, setIsLinkExpired] = useState(false);

  const { shortenUrl, loading, error } = useUrlShortener();

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

      const longUrl = `http://localhost:9000/${linkId}`;

      //Short the URL before sharing it
      const shortUrl = await shortenUrl(longUrl)

      setShareableLink(shortUrl);
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
    <div className="container">
      <h1>Instant Share the Files</h1>
      <div className="main-layout">
        <div className="left-pane">
          <h2>Select files to send</h2>
          <input  type="file" className= {files.length>0 ? "is_files" : ""}  multiple onChange={handleFileSelect} />
          <button onClick={generateShareableLink}>
            Generate Shareable Link & QR Code
          </button>

          {/* {files.length > 0 && (
        <div className="file-list">
          <h4>Selected files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )} */}
        </div>

        {shareableLink && (
          <div className="right-pane">
            <div className="qr-code-box">
              <QRCode value={shareableLink} size={150} />
            </div>
            <div className="link-info">
              <h3>Share this link:</h3>
              <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                {shareableLink}
              </a>
              {isLinkExpired && (
                <p className="expired-message">This link has expired.</p>
              )}
              <p className="expiration-time">
                Link expires at: {expirationTime?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
