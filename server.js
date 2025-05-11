// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (InfinityFree frontend will connect)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Relay WebRTC offer to other clients
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  // Relay WebRTC answer to other clients
  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  // Relay ICE candidates to other clients
  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
