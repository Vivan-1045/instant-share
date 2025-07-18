const crypto = require("crypto");

const encryptBuffer = (buffer, password) => {
  const iv = crypto.randomBytes(16); 
  const key = crypto.createHash('sha256').update(password).digest(); 

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return Buffer.concat([iv, encrypted]);
};

const decryptBuffer = (buffer, password) => {
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);
  const key = crypto.createHash('sha256').update(password).digest();

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};

module.exports = { encryptBuffer, decryptBuffer };