import React, { useState } from "react";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL;

const DecryptFile = ({ fileUrl, onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadEncryptedFile = async () => {
    try {
      setLoading(true);

      const linkId = fileUrl.split("/").pop();

      const response = await axios.post(
        `${apiBase}/secureDownload`,
        {
          linkId,
          password,
        },
        {
          responseType: "arraybuffer",
        }
      );

      const encryptedData = new Uint8Array(response.data);

      const iv = encryptedData.slice(0, 16);
      const ciphertext = encryptedData.slice(16);

      // Getting AES-256 key from password using SHA-256
      const encoder = new TextEncoder();
      const passwordBytes = encoder.encode(password);
      const keyBuffer = await crypto.subtle.digest("SHA-256", passwordBytes);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      );

      // Decrypt
      const decryptedArrayBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: iv },
        cryptoKey,
        ciphertext
      );

      const blob = new Blob([decryptedArrayBuffer], {
        type: "application/zip",
      });

      // Download Section
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "files.zip";
      a.click();

      window.URL.revokeObjectURL(url);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);

      if (err.response) {
        const { status, data } = err.response;

        if (status === 403) {
          alert("Incorrect password.");
        } else if (status === 400) {
          alert(data.error || "Link expired or invalid.");
        } else {
          alert("Download failed.");
        }
      } else {
        alert("Network error or server unreachable.");
      }

      console.error(err);
    }
  };

  return (
    <>
      <div className="modal">
        <h3>Enter Password to Download</h3>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`password-input ${password ? "filled" : ""}`
          }
        />
      </div>
      <div className="button-group">
        <button
          className="downloadButton"
          onClick={downloadEncryptedFile}
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download"}
        </button>
        <button className="cancelButton" onClick={onClose}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default DecryptFile;
