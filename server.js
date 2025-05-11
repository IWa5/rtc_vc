const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let users = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // New user joins
  socket.on('join-channel', (username) => {
    users.push({ id: socket.id, username });
    io.emit('user-list', users); // Broadcast user list
  });

  // User leaves the channel
  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('user-list', users); // Broadcast updated user list
  });

  // Handling offer, answer, and ice-candidates for WebRTC
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
