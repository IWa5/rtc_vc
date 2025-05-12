const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }

  app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

let users = {};

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));

    socket.broadcast.emit("new-user", socket.id);

    socket.on("offer", ({ to, offer }) => {
      io.to(to).emit("offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("answer", { from: socket.id, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", { from: socket.id, candidate });
    });

    socket.on("disconnect", () => {
      delete users[socket.id];
      io.emit("users", Object.values(users));
      socket.broadcast.emit("user-left", socket.id);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port " + PORT));
