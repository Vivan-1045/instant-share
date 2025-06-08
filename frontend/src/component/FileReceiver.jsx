// import React, { useEffect, useState } from "react";
// import Peer from "peerjs";
// import { useSearchParams } from "react-router-dom";

// const FileReceiver = () => {
//   const [searchParams] = useSearchParams();
//   const senderPeerId = searchParams.get("id");
//   const [peer, setPeer] = useState(null);
//   const [fileInfo, setFileInfo] = useState(null);

//   useEffect(() => {
//     if (!senderPeerId) return;

//     const newPeer = new Peer();
//     newPeer.on("open", () => {
//       const conn = newPeer.connect(senderPeerId);
      
//       conn.on("data", (receivedData) => {
//         setFileInfo(receivedData);

//         // Auto-download the received file
//         const blob = new Blob([receivedData.data]);
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = receivedData.name;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       });
//     });

//     setPeer(newPeer);
//   }, [senderPeerId]);

//   return <h2>Receiving file...</h2>;
// };

// export default FileReceiver;