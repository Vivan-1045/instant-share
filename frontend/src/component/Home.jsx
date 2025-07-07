import { useUrlShortener } from "./ShortUrl";
import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import "../styles/styles.css";
const apiBase = import.meta.env.VITE_API_URL;

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

      // Send POST request to server
      console.log(apiBase)
      const response = await axios.post(`${apiBase}/generateLink`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { linkId, expirationTime } = response.data;

      const longUrl = `${apiBase}/${linkId}`;

      //Short the URL before sharing it
      const shortUrl = await shortenUrl(longUrl);

      setShareableLink(shortUrl);
      setExpirationTime(new Date(expirationTime)); // Triggers useEffect
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };

  //it manages expiration time
  useEffect(() => {
    if (!expirationTime) return;

    setIsLinkExpired(false);
    const interval = setInterval(() => {
      if (new Date() > expirationTime) {
        setIsLinkExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  return (
    <div className="container">
      <h1>Drop. Share. Done.</h1>
      <div className="main-layout">
        <div className="left-pane">
          <h2>Select files to send</h2>
          <input
            type="file"
            className={files.length > 0 ? "is_files" : ""}
            multiple
            onChange={handleFileSelect}
          />
          <button onClick={generateShareableLink}>
            Generate Link & QR Code
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
