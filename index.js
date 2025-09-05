const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io
const io = new Server(server);

// Socket.io logic
io.on('connection', (socket) => {
  console.log("✅ New user connected:", socket.id);

  // Listen for user messages
  socket.on("user-message", (message) => {
    console.log("📩 New User Message:", message);

    // Send message to ALL clients (including sender)
    io.emit("server-message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Serve index.html explicitly (optional since static is used)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
