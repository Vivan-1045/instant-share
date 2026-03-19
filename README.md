# 🚀 Instant Share

**Secure, anonymous file sharing — no login required.**

Instant Share allows you to transfer files securely from your browser with end-to-end encryption, password protection, and simple sharing via links or QR codes.

---

## 🔗 Live Demo

👉 https://instant-share-black.vercel.app

---

## ✨ Features

### 🔒 End-to-End Encryption
- Uses **AES-256-CBC**
- Optional **password protection**
- Secure **IV (Initialization Vector)** handling for reliable encryption/decryption

---

### ⚡ Fast File Transfers
- Efficient client-server file transfer
- Optimized for quick uploads and downloads

---

### 📱 Easy Sharing
- Share files via:
  - QR codes  
  - Direct download links  

---

### 👤 100% Anonymous
- No login required  
- Privacy-focused temporary sharing  

---

### ⚙️ Modern Tech Stack
- **Frontend:** React  
- **Backend:** Node.js + Express  
- **Encryption:** Node Crypto + CryptoJS  

---

## 🔐 Security Fix (Important)

### 🐞 Previous Issue
Encrypted downloads failed because:
- IV was generated on the backend  
- But not properly shared with the frontend  

This caused:
- Corrupted files  
- Failed decryption  

---

### ✅ Fix Implemented
- IV is now **prepended to encrypted data**
- Frontend **extracts IV before decryption**

✔ Correct AES-256-CBC decryption  
✔ No more corrupted downloads  
✔ Consistent encryption flow  

---

## 🛠️ Tech Stack

| Technology   | Role                    |
|-------------|-------------------------|
| React       | Frontend UI             |
| Node.js     | Backend runtime         |
| Express     | API server              |
| Node Crypto | Backend encryption      |
| CryptoJS    | Frontend decryption     |

---

## 📦 Installation

### 1. Clone the Repository
```bash
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
