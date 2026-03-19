import { useUrlShortener } from "./ShortUrl";
import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import "../styles/styles.css";
import VisitorCount from "./VisitorCount";
const apiBase = import.meta.env.VITE_API_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [shareableLink, setShareableLink] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [isLinkExpired, setIsLinkExpired] = useState(false);

  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [originalLink, setOriginalLink] = useState("");
  const [isSubmitting,setIsSubmitting] = useState(false);
  const { shortenUrl, loading, error } = useUrlShortener();

  const totalSize = 100 * 1024 * 1024;

  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files];
    let size = 0;

    for (let file of selectedFiles) {
      if (file.size > totalSize) {
        alert(`${file.name} exceeds the 100MB file size limit.`);
        window.location.reload();
        return;
      }
      size += file.size;
    }

    if (size > totalSize) {
      alert("Total file size exceeds 100MB limit.");
      window.location.reload();
      return;
    }
    setFiles(selectedFiles);
  };

  const generateShareableLink = async () => {
    if (files.length === 0) {
      alert("Select at least one file.");
      return;
    }

    if(isSubmitting){
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      if (password) {
        formData.append("password", password);
      }

      const response = await axios.post(`${apiBase}/generateLink`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { linkId, expirationTime, isEncrypted } = response.data;

      const longUrl = `https://instant-share-black.vercel.app/download/${linkId}`;
      const shortUrl = await shortenUrl(longUrl);

      setOriginalLink(longUrl);
      setShareableLink(shortUrl);
      setExpirationTime(new Date(expirationTime));
      setIsEncrypted(isEncrypted);
    } catch (error) {
      if (error.response?.status === 429) {
        alert("Too many requests. Please wait before trying again.");
        return;
      }

      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to generate link. Try again.");
      }
    } finally{
      setIsSubmitting(false);
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
    <>
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

            <input
              type="password"
              placeholder="If Confidential, enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`password-input ${password.length > 0 ? "filled" : ""}`}
            />
            <button onClick={generateShareableLink} disabled={isSubmitting}>
              {isSubmitting ? "Generating...":"Generate Link & QR Code"}
            </button>
          </div>

          {shareableLink && (
            <div className="right-pane">
              <div className="qr-code-box">
                <QRCode value={shareableLink} size={150} />
              </div>
              <div className="link-info">
                <h3>Share this link:</h3>

                <a
                  href={`/download/${originalLink.split("/").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

        {/*handled in GlobalDownload */}
      </div>{" "}
      <div className="bottom-tag">
        <VisitorCount />
      </div>
    </>
  );
}

export default App;
