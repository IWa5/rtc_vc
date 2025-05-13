const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend origin
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Health check route for UptimeRobot
app.get("/health", (req, res) => {
  res.send("You rolled a 3 (Servers active)");
});

// Dice root route
app.get("/", (req, res) => {
  res.send("You rolled a 2 (Servers active)");
});

// Dice root route
app.get("/", (req, res) => {
  res.send("You rolled a 1 (Servers active)");
});

// Dice root route
app.get("/", (req, res) => {
  res.send("You rolled a 4 (Servers active)");
});

let users = {};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("join", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("new-user", socket.id);
    io.emit("users", Object.values(users));
    console.log(`${username} joined`);
  });

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
    console.log(`Disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit("user-left", socket.id);
    io.emit("users", Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
