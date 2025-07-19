import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DecryptFile from "./DecryptFile";

const apiBase = import.meta.env.VITE_API_URL;

const GlobalDownload = () => {
  const { linkId } = useParams();
  const [showDecryptModal, setShowDecryptModal] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        const response = await axios.get(`${apiBase}/${linkId}`);

        if (response.data.isEncrypted) {
          setShowDecryptModal(true);
        } else {
          //If no password set , download it directly
          window.location.href = `${apiBase}/${linkId}`;
        }
      } catch (err) {
        alert("Link expired or invalid.");
      }
    };

    checkLink();
  }, [linkId]);

  return (
    <div>
      {showDecryptModal && (
        <DecryptFile
          fileUrl={`${apiBase}/${linkId}`}
          onClose={() => setShowDecryptModal(false)}
        />
      )}
    </div>
  );
};

export default GlobalDownload;