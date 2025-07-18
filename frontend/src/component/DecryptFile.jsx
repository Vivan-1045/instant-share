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

      const response = await axios.post(`${apiBase}/secureDownload`, {
        linkId,
        password,
      }, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "files.zip";
      a.click();

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
    <div className="modal">
      <h3>Enter Password to Download</h3>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="downloadButton" onClick={downloadEncryptedFile} disabled={loading}>
        {loading ? "Downloading..." : "Download"}
      </button>
      <button className="cancelButton" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default DecryptFile;
