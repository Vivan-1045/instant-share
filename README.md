# 🚀 Instant Share 

**Secure, anonymous, real-time file sharing — no login needed.**  
Built with **React**, **Node.js**, **WebSocket**, **Express**, and **CryptoJS/Node Crypto**.

🔗 [Live Demo ⬇️](https://instant-share-black.vercel.app/)

---

## 🔧 Features

- 🔒 **End-to-End Encryption (AES-256-CBC)**  
  - Optional password protection  
  - Dynamically generated **IV (Initialization Vector)** handled properly between backend and frontend for secure encryption/decryption
- ⚡ **Real-Time Transfers**  
  - Uses **WebSockets** for instant, peer-to-peer file sharing
- 📱 **Quick Access**  
  - Share files via **QR codes** or direct download links
- 👤 **No Login Required**  
  - 100% anonymous and temporary transfers
- ⚙️ **Modern Stack**  
  - Built with **React** (frontend) & **Node.js + Express** (backend)

---

## 🔐 **Security Update**

**Previously:**  
Encrypted file downloads failed because the IV (Initialization Vector) was generated dynamically on the backend but not passed correctly to the frontend during decryption.

**Now:**  
The IV is **prepended to the encrypted data** when sent to the client.  
During decryption, the frontend **extracts the IV from the file**, ensuring correct AES-256-CBC decryption.

This fixes issues with:

- Encrypted downloads showing corrupted zip files  
- Decryption failing due to IV mismatch

---

## 🛠️ Tech Stack

| Technology   | Role                   |
|--------------|------------------------|
| React        | Frontend UI            |
| Node.js      | Backend runtime        |
| Express      | Web server & APIs      |
| WebSocket    | Real-time communication |
| Node Crypto  | Backend encryption     |
| CryptoJS     | Frontend decryption    |

---

## 🖥️ Installation

```bash
# Clone the repository
git clone https://github.com/Vivan-1045/instant-share.git
cd instant-share

# Install backend dependencies
cd server
npm install
npm start   # Starts the backend

# Open a new terminal for frontend
cd ../frontend
npm install
npm run dev  # Starts the frontend on localhost