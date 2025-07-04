# 🚀 Instant Share 

**Secure, anonymous, real-time file sharing — no login needed.**  
Built with **React**, **Node.js**, **WebSocket**, **Express**, and **CryptoJS**.

🔗[live here⬇️](https://instant-share-black.vercel.app/)
---

## 🔧 Features

- 🔒 **End-to-End Security**: Optional password-protected encryption via **CryptoJS**
- ⚡ **Real-Time Transfers**: Uses **WebSockets** for instant, peer-to-peer file sharing
- 📱 **Quick Access**: Share files via **QR codes** or direct download links
- 👤 **No Login Required**: 100% anonymous, temporary transfers
- ⚙️ **Modern Stack**: Built with **React** (frontend), **Node.js + Express** (backend)

---

## 🛠️ Tech Stack

| Technology  | Role            |
|-------------|-----------------|
| React       | Frontend UI     |
| Node.js     | Backend runtime |
| Express     | Web server API  |
| WebSocket   | Real-time comms |
| CryptoJS    | File encryption |

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
