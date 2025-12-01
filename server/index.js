const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const VisitorRoute = require('./route/visitor');
const fileRoute = require('./route/fileRoute');

const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
dotenv.config();
connectDB();


const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use('/',fileRoute);
app.use('/api/visitor', VisitorRoute);

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
